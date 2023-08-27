# Milestone1 Docker images

## Docker Compose

The complete stack for Milestone1 can be tested using the *compose.yaml* by issuing from this directory

    $ docker compose up
	
This will


* build the okAlice-Astar collator
* start a relay- and parachain via zombienet with this collator
* download, compile and deploy the contracts on the parachain
* start the off-chain validator-selector

After a succesful run you can find:

* The parachain collator at **ws://localhost:9944**
* The compiled collator in *artefacts/bin*
* The compiled contracts in *artefacts/contract*.

The build is opportunistic: when the artefacts are present (in *milestone1/artefacts*) the collator or contracts will not be rebuild. You'll have to remove them manually in between runs to rebuild.

## Zombienet Container

It can be useful to use the *Zombienet Container* standalone for deployment of contracts or other tests. For this to work, the collator binary must be present in *milestone1/artefacts/bin*.

It can be started with:

    $ docker build -f Dockerfile.zombienet -t okalice/milestone1
	$ docker run -p 9944:9944 -p 9946:9946 okalice/milestone1
	
This will start the *single_parachain.toml* setup as found in *scripts/*. 

After a succesful run

* The relaychain node can be reached at **ws://localhost9946**
* The parachain collator can be reached at **ws://localhost:9944**




