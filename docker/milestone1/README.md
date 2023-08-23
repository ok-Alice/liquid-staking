# Milestone1 Docker images

## Docker Compose

The complete stack for Milestone1 can be tested using the *compose.yaml* by issuing from this directory

    $ docker compose up
	
This will

* start a relay- and parachain via zombienet
* download, compile and deploy the contracts on the parachain

After a succesful run

* The parachain collator can be reached at **ws://localhost:9944**
* The compiled contracts are saved in *artefacts/*.

## Zombienet Container

It can be useful to use the *Zombienet Container* standalone for deployment of contracts or other tests. It can be started with:

    $ docker build -f Dockerfile.zombienet -t okalice/milestone1
	$ docker run -p 9944:9944 -p 9946:9946 okalice/milestone1
	
This will start the *single_parachain.toml* setup as found in *scripts/*. 

After a succesful run

* The relaychain node can be reached at **ws://localhost9946**
* The parachain collator can be reached at **ws://localhost:9944**




