# create REC with id 1

curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"name": "rec1"}' http://localhost:8001/rec

# add member with id 1 to REC with id 1

curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"k1\": \"v1\" }"}' http://localhost:8001/recs/1/member

# add meterpoint with id 1 for member with id 1

curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"k1\": \"v1\" }"}' http://localhost:8001/members/1/meterpoint

# add measurement with id 1 for meterpoint with id 1

curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"value": 11.43 }' http://localhost:8001/meterpoints/1/measurement

# add meterpoint with mqttTopic
curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"k1\": \"v1\" }", "mqttTopic": "energyMgmt/project-id-Eisenstadt/sensors/gateway-uuid-1/EnergieKompass-1/Piko/ACTotalPower"}' http://localhost:8001/members/1/meterpoint
