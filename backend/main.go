package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Numbers struct {
	Num1 float64 `json:"num1"`
	Num2 float64 `json:"num2"`
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
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Unknown error"})
		return
	}
	if err := json.Unmarshal(reqBody, &nums); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Please enter two valid numbers"})
		return
	}

	shaSumBytes := sha256.Sum256([]byte(strconv.FormatFloat(nums.Num1+nums.Num2, 'f', -1, 64)))
	shaSumStr := hex.EncodeToString(shaSumBytes[:])
	shaSum := SumSHA{Sum: shaSumStr}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(shaSum)
}

func getLineFromFile(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%s", "in get line from file")
}

func main() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/go/sha256/", getSumAsSHA).Methods("POST")
	router.HandleFunc("/go/write/{lineno}/", getLineFromFile).Methods("GET")

	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":8080", handler))
}