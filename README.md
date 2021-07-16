# Persistence

Model: http://www.plantuml.com/plantuml/uml/ZP31QiCm44Jl-eez1-8l225GMWYXKDfZo64J3KQWbOEyAeJA_rxRjL7LKqyQQRNpXZdqob6JU8EWJX_q_ln4NuPeGywEntOxwpOw-u5M47I-inKNNY5NnAEbtUxbjD-F0u6oPULHtjFLkzi93pEOrVjdeRQljsfEyI2AkFqX8RvrBkZHdY_bFNOUvql5N3_MtF-avJv52DRL2bgG6r8dw9NbNWhxP9ymgzwrWJL5JDPJkqDkcYulPPYbazmrJSw_qfeYQLY69P0v8DWa_Xi0

init db:
```
npx knex migrate:latest
```

# test cmds

## create new rec
```
curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"name": "rec1"}' http://localhost:8001/rec
```

## add member to rec

```
curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"k1\": \"v1\" }"}' http://localhost:8001/recs/1/member
```

## get recs

```
curl -s http://localhost:8001/recs | jq
```

## add meterpoint for member

```
curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"k1\": \"v1\" }"}' http://localhost:8001/members/5/meterpoint
```

## add meterpoint with mqttTopic

```
curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"metadata": "{ \"k1\": \"v1\" }", "mqttTopic": "energyMgmt/project-id-Eisenstadt/sensors/gateway-uuid-1/EnergieKompass-1/Piko/ACTotalPower"}' http://localhost:8001/members/1/meterpoint
```

## add measurement for meterpoint

```
curl -w "%{http_code}" -X POST -H "Content-Type: application/json" --data '{"value": 22.43 }' http://localhost:8001/meterpoints/1/measurement
```

run redis:
```
docker run --name redis-7energy-dev -v redis_data:/data -p 127.0.0.1:6379:6379 redis redis-server --appendonly yes
```

# TODO

* How to deal with members not yet assigned to a REC?
  * Have a REC (id 0?) grouping all unassigned members
  * have no REC assigned and a dedicated GET endpoint (e.g. /unassigned-members)

## permissioning

Roles:
* can create RECs 
* REC admin
* member
* meterpoint (cronjob/process reading from MQTT ?)
