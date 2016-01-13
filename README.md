# D3 Chart + Map with Common Data

## Runbook

Start Python server to serve local files

	python -c "import SimpleHTTPServer; m = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map; m[''] = 'text/plain'; m.update(dict([(k, v + ';charset=UTF-8') for k, v in m.items()])); SimpleHTTPServer.test();"

Then, go to [port 8000 on local](hosthttp://localhost:8000/index.html).

We do this so we can load remote libraries in the future; currently we keep local copies of D3 et. al.

## TODO

1. Why the hell doesn't Saudi work?
2. Add legend to map (show color scale of user growth, absolute and relative)
3. Make button change text