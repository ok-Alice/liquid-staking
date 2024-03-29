# Milestone1 Docker images

## Docker Compose

The complete stack for Milestone1 can be tested using the *compose.yaml* by issuing from this directory

    $ docker compose up
	
This will


* build the okAlice-Astar collator
* build the Polkadot node
* start a relay- and parachain via zombienet with this collator
* download, compile and deploy the contracts on the parachain
* start the off-chain validator-selector

After a succesful run you can find:


* The compiled collator and polkadot binaries in *artefacts/bin*
* The compiled contracts in *artefacts/contract*.
* Exposed ports:
    - collator1 at **ws://localhost:9944**
	- collator2 at **ws://localhost:9945**
    - alice     at **ws://localhost:9946**
	- bob       at **ws://localhost:9947**
* Contracts deployed to collator
* Oracle populated with live data

The build is opportunistic: when the artefacts are present (in *milestone1/artefacts*) the collator or contracts will not be rebuild. You'll have to remove them manually in between runs to rebuild.

## Zombienet Container

It can be useful to use the *Zombienet Container* standalone for deployment of contracts or other tests. For this to work, the collator binary must be present in *milestone1/artefacts/bin*.

It can be started with:

    $ docker build -f Dockerfile.zombienet -t okalice/milestone1
	$ docker run -p 9944:9944 -p 9945:9945 -p 9946:9946 -p 9947:9947 okalice/milestone1
	
This will start the *single_parachain.toml* setup as found in *scripts/*. 

After a succesful run the same ports as above will be exposed.




