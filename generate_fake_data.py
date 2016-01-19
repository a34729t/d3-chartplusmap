import datetime, random


# Dates
numdays = 180
base = datetime.datetime.today()
date_list = [base - datetime.timedelta(days=x) for x in range(0, numdays)]

# for date in date_list:
	# print date.strftime("%d-%b-%Y")

# Country codes
allCountryData = []

for line in open("code2country.tsv", "r"):

	# parse file
	arr = line.split("\t")
	code = arr[1]
	name = arr[4]
	population = arr[7].translate(None, ',')

	if int(population) < (10 ** 5):
		continue

	# output JSON
	
	countryData = []

	for date in reversed(date_list):

		# Only get Saturdays data
		if date.strftime("%A") != "Saturday":
			continue

		valueAdjusted = str(int(random.uniform(0.9, 1.4) * float(population)))

		datum = ""
		datum += "\t\t"
		datum += "{ "
		datum += '"name": "'+name+'", '
		datum += '"code": "'+code+'", '
		datum += '"date": "'+date.strftime("%d-%b-%y")+'", '
		datum += '"pop": '+population+', '
		datum += '"value": '+valueAdjusted+''
		datum += " }"
		countryData.append(datum)
	
	countryDataStr = ""
	countryDataStr += "\t[\n"
	countryDataStr += ",\n".join(countryData)
	countryDataStr += "\n"
	countryDataStr += "\t]"
	allCountryData.append(countryDataStr)

print "["
print ",\n".join(allCountryData)
print "]"