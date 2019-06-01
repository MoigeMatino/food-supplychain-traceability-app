/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * Sample transaction
 * @param {org.sahihi2.BootstrapNetwork} bootstrapNetwork
 * @transaction
 */
async function bootstrapNetwork(tx) {
    const factory = getFactory();
    const NS = 'org.sahihi2';

    // create farmer 1

    const farmer1 = factory.newResource(NS, 'Farmer', 'F001');
    farmer1.tradeCode = '0708112000009';
    farmer1.address = 'Kilusu, Narok, Kenya';
    farmer1.farmName = 'Kinasu Farms';

    // create farmer 2

    const farmer2 = factory.newResource(NS, 'Farmer', 'F002');
    farmer2.tradeCode = '0708112000009';
    farmer2.address = 'Nyeri, Kiambu, Kenya';
    farmer2.farmName = 'Nyeki Growers';

    const farmer3 = factory.newResource(NS, 'Farmer', 'F003');
    farmer3.tradeCode = '0081953000002';
    farmer3.address = 'Kyevaluki, Machakos, Kenya';
    farmer3.farmName = 'Kyema Produce';

    // create retailer 1

    const retailer1 = factory.newResource(NS, 'Retailer', 'R001');
    retailer1.tradeCode = '0088393000303';
    retailer1.address = 'Sokokubwa, Maritini, Kenya';

    // create consumer 1

    const consumer1 = factory.newResource(NS, 'Consumer', 'C001');
    consumer1.tradeCode = '0088393000303';
    consumer1.address = 'Nyamira, Kisii, Kenya';

    // create consumer 2

    const consumer2 = factory.newResource(NS, 'Consumer', 'C002');
    consumer2.tradeCode = '0088393000304';
    consumer2.address = 'Bondo, Siaya, Kenya';

    //create distributor 1

    const distributor1 = factory.newResource(NS, 'Distributor', 'D001');
    distributor1.tradeCode = '0088393000201';
    distributor1.address = 'Kilusu, Narok, Kenya';
    
    //create distributor 2
    
    const distributor2 = factory.newResource(NS , 'Distributor', 'D002');
    distributor2.tradeCode = '0088393000202';
    distributor2.address = 'Nyeri, Kiambu, Kenya';

    // add the growers

    const growerRegistry = await getParticipantRegistry(NS + '.Farmer');
    await growerRegistry.addAll([farmer1, farmer2, farmer3]);

    // add the retailers

    const retailerRegistry = await getParticipantRegistry(NS + '.Retailer');
    await retailerRegistry.addAll([retailer1]);

    // add the consumers

    const consumerRegistry = await getParticipantRegistry(NS + '.Consumer');
    await consumerRegistry.addAll([consumer1, consumer2]);

    //add the distributors

    const distributorRegistry = await getParticipantRegistry(NS + '.Distributor');
    await distributorRegistry.addAll([distributor1, distributor2]);

}

/**
 * Sample transaction
 * @param {org.sahihi2.CreateContract} createContract
 * @transaction
 */
async function createContract(c) {
    const factory = getFactory();
    const NS = 'org.sahihi2';

    // create contract

    const contract = factory.newResource(NS, 'CommodityContract', c.contractId);
    contract.farmer = c.farmer;
    //contract.retailer = c.retailer;
    contract.consumer = c.consumer;
    contract.activity = c.activity;
    contract.commodity = c.commodity;

    // add the contract

    const contractRegistry = await getAssetRegistry(NS + '.CommodityContract');
    await contractRegistry.addAll([contract]);
}


/**
 * Sample transaction
 * @param {org.sahihi2.CreateCommodityShipment} createCommodityShipment
 * @transaction
 */
async function createCommodityShipment(s) {
    const factory = getFactory();
    const NS = 'org.sahihi2';

    console.log(s);

        

    const commodityShipment = factory.newResource(NS, 'CommodityShipment', s.gtin);
    commodityShipment.contract = s.contract;
    commodityShipment.packagingDate = s.packagingDate;
    commodityShipment.expirationDate = s.expirationDate;
    commodityShipment.sellByDate = s.sellByDate;
    commodityShipment.lotSerial = s.lotSerial;
    commodityShipment.quantity = s.quantity;
    commodityShipment.unit = s.unit;
    commodityShipment.distributor = s.distributor;
    commodityShipment.status = 'IN_TRANSIT';

    // add the shipment
    
    const commodityShipmentRegistry = await getAssetRegistry(NS + '.CommodityShipment');
    await commodityShipmentRegistry.addAll([commodityShipment]);

    /**
     * let shipCreationEvent = factory.newEvent(NS, 'ShipmentCreated');
     * shipCreationEvent.shipment = commodityshipment;
     * emit(shipCreationEvent);
     */
    
}
/**
 * Sample transaction
 * @param {org.sahihi2.UpdateLocation} updateLocation
 * @transaction
 */

async function updateLocation(l) {
    
    const NS = 'org.sahihi2';

    console.log(l);
  	const commodityshipment = l.commodityshipment
        

    
    commodityshipment.lat = l.lat;
    commodityshipment.lngitude = l.lng;
    commodityshipment.city = l.city;
    commodityshipment.time = l.time;
    
    // to update registry
    
    const commodityShipmentRegistry = await getAssetRegistry(NS + '.CommodityShipment');
    await commodityShipmentRegistry.update(commodityshipment);

    /**
     * let shipCreationEvent = factory.newEvent(NS, 'ShipmentCreated');
     * shipCreationEvent.shipment = commodityshipment;
     * emit(shipCreationEvent);
     */
    
}

/**
 * Sample transaction
 * @param {org.sahihi2.ShipCommodity} shipCommodity
 * @transaction
 */
async function shipCommodity(s) {
    const factory = getFactory();
    const NS = 'org.sahihi2';

    const shipment = s.commodityshipment;

    if (shipment.status !== 'RECEIVED' ) {//&& shipment.status !== 'IN_TRANSIT'
        shipment.status = 'IN_TRANSIT';
    } else {
        throw new Error('Cannot ship an item that has been received!');
    }

    // add the shipment
    const shipmentRegistry = await getAssetRegistry(NS + '.CommodityShipment');
    await shipmentRegistry.update(shipment);


    /**
     * let shipEvent = factory.newEvent(NS, 'ShipmentShipped');
        shipEvent.shipment = commodityshipment;
        shipEvent.to = s.to;
        shipEvent.from = s.from;
        emit(shipEvent);
     
     */

}

/**
 * Sample transaction
 * @param {org.sahihi2.ReceiveCommodity} receiveCommodity
 * @transaction
 */
async function receiveCommodity(s) {
    const factory = getFactory();
    const NS = 'org.sahihi2';

    const shipment = s.commodityshipment;
    if (shipment.status === 'IN_TRANSIT') {
        shipment.status = 'RECEIVED';
    } else {
        throw new Error('Cannot receive a shipment that is not in transit!');
    }

    // add the shipment

    const shipmentRegistry = await getAssetRegistry(NS + '.CommodityShipment');
    await shipmentRegistry.update(shipment);

    /**
     * let shipEvent = factory.newEvent(NS, 'ShipmentReceived');
        shipEvent.shipment = shipment;
        emit(shipEvent);
     */
}





























