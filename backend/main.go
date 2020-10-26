package main

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

type JSONFloat64 struct {
	Value float64
	Valid bool
	Set   bool
}

func (i *JSONFloat64) UnmarshalJSON(data []byte) error {
	i.Set = true

	if string(data) == "null" {
		i.Valid = false
		return nil
	}

	var temp float64
	if err := json.Unmarshal(data, &temp); err != nil {
		return err
	}
	i.Value = temp
	i.Valid = true
	return nil
}

type Numbers struct {
	Num1 JSONFloat64 `json:"num1"`
	Num2 JSONFloat64 `json:"num2"`
}

type SumSHA struct {
	Sum string `json:"sum"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

func getSumAsSHA(w http.ResponseWriter, r *http.Request) {
	var nums Numbers
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Error processing request body"})
		return
	}
	if err := json.Unmarshal(reqBody, &nums); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Please enter two valid numbers"})
		return
	}

	if !(nums.Num1.Valid) || !(nums.Num2.Valid) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Please enter two valid numbers"})
		return
	}
	shaSumBytes := sha256.Sum256([]byte(strconv.FormatFloat(nums.Num1.Value+nums.Num2.Value, 'f', -1, 64)))
	shaSumStr := hex.EncodeToString(shaSumBytes[:])
	shaSum := SumSHA{Sum: shaSumStr}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shaSum)
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func getLineFromFile(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	linesFile := os.Getenv("LINES_FILE")

	linenoStr := r.URL.Query().Get("lineno")
	if linenoStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "No line number given"})
		return
	}

	lineno, err := strconv.Atoi(linenoStr)
	if err != nil || lineno < 1 || lineno > 100 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Line number should be between 1 and 100"})
		return
	}
	f, err := os.Open(linesFile)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Error reading file"})
		return
	}
	defer f.Close()
	bf := bufio.NewReader(f)
	var line string
	for lnum := 0; lnum < lineno; lnum++ {
		line, err = bf.ReadString('\n')
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(ErrorResponse{Message: "Error reading line"})
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(line)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/go/sha256/", getSumAsSHA).Methods("POST")
	router.HandleFunc("/go/write/", getLineFromFile).Methods("GET")

	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":8080", handler))
}
