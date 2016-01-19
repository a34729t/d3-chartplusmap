# D3 Chart + Map with Common Data

## Runbook

Start Python server to serve local files

	python -c "import SimpleHTTPServer; m = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map; m[''] = 'text/plain'; m.update(dict([(k, v + ';charset=UTF-8') for k, v in m.items()])); SimpleHTTPServer.test();"

Then, go to [port 8000 on local](http://localhost:8000/index.html).

We do this so we can load remote libraries in the future; currently we keep local copies of D3 et. al.

## Generate fake data

Generate fake data using this command:

	python generate_fake_data.py > all_country_data.json

Currently, it generates data for the past 180 days, and saves only the Saturdays for each week. To change this, modify the script's source code.