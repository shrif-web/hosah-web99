# Setup
```bash
cd load-test
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

After setup run locust with any of the files you want, for example:
```bash
locust -f go_sha.py
```
Then navigate to [locust page](http://localhost:8089) and enter total users, server url (for example http://192.168.10.10/ don't forget slash at the end) and spawn rate.