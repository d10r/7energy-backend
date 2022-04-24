# Assumptions: 
# * run with an empty DB. Otherwise the id associations won't be as expected
# * the API is running on localhost at the default port 8001

# create REC with id 1
curl -X POST -H "Content-Type: application/json" --data '{"name": "Energiegemeinschaft lab10 & friends", "gridSegment": "AT.008100", "publicKey": "4198f3f3451f5a02046cb2eda8d4a31e879c125e67c54318a0c3d3517fc5a57a3ddb32050b620d00aaad17e966952686f6cb457af6b5cb8c683354b2072c76fb"}' http://localhost:8001/rec

# add member with id 1 to REC with id 1
curl -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"name\": \"Didi\" }", "gridSegment": "AT.008100.08042", "publicKey": "4b3267b5e85c323d6358ef30077f6634ee0de8430c08d23b55c35a01ff3ef395e498d60daaafdf2772a6bbfc2bcc5a6fc5d180441be14b6d091836cf55817eb7"}' http://localhost:8001/recs/1/member

# add member with id 2 which isn't assigned to any REC
curl -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"name\": \"Hans\" }", "gridSegment": "AT.008100.08010", "publicKey": "9cf77766376094746472ccd4ef026beb95ad45dc5aba5be0a2e321791c6eebe210a659e670ee605a503c1e5386990a42015bcecfe8d6181215089c47e460cc77"}' http://localhost:8001/member

# add meterpoint with id 1 for member with id 1
curl -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"id\": \"AT.008100.08042.AO6G56M11SN51G21M24S\" }", "mqttTopic": "REC1/M1/MP1/ACTotalPower", "publicKey": "56546aa1606e4711c1d4a849716257e52851b809fa197814d7f2465a8a0cdc7c23fd7ae66484dc4c50acdc4e48905be3dcbe737118fba1fa1eb838c45afe10f4"}' http://localhost:8001/members/1/meterpoint

# add measurement with id 1 for meterpoint with id 1
curl -X POST -H "Content-Type: application/json" --data '{"value": "1143000", "timestamp": "1643024495", "signature": "f2790ed53c803ee882c892e1d9715181dfc93780d755fbe4ffefd90701e15c31"}' http://localhost:8001/meterpoints/1/measurement


# Pretty-formatted output of the persisted data as returned by the API

echo "RECs:"
curl -s http://localhost:8001/recs | jq

echo "members of REC 1:"
curl -s http://localhost:8001/recs/1/members | jq

echo "unassigned members:"
curl -s http://localhost:8001/unassigned-members | jq

echo "meter points of member 1:"
curl -s http://localhost:8001/members/1/meterpoints | jq

echo "measurements of meterpoint 1:"
curl -s http://localhost:8001/meterpoints/1/measurements | jq
