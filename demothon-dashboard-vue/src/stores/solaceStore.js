import { ref } from 'vue';
import { defineStore } from 'pinia'
import solace, { MessageDeliveryModeType, QueueDescriptor } from 'solclientjs'

export const useSolaceStore = defineStore('solaceStore', () => {


  const factoryPropers = new solace.SolclientFactoryProperties();
  factoryPropers.profile = solace.SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(factoryPropers);

  const solaceClient = {};
  solaceClient.session = null;

  const brokerConfig = {};
  brokerConfig['url'] = import.meta.env.VITE_SOLACE_URL;
  brokerConfig['vpnName'] = import.meta.env.VITE_SOLACE_VPN;
  brokerConfig['userName'] = import.meta.env.VITE_SOLACE_USERNAME;
  brokerConfig['password'] = import.meta.env.VITE_SOLACE_PASSWORD;

  async function connect() {
    return new Promise((resolve, reject) => {
      if (solaceClient.session !== null) {
        console.log('Solace session already created')
        resolve()
      }

      try {
        solaceClient.session = solace.SolclientFactory.createSession(brokerConfig);
      } catch (error) {
        console.log(error);
        reject(error)
      }

      solaceClient.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
        console.log('=== Successfully connected and ready to subscribe. ===')
        resolve();
      });

      solaceClient.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
        console.log('Connection failed to the message router: ' + sessionEvent.infoStr +
          ' - check correct parameter values and connectivity!');
        reject(sessionEvent);
      });

      solaceClient.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
        console.log('Disconnected.');
        solaceClient.subscribed = false;
        if (solaceClient.session !== null) {
          solaceClient.session.dispose();
          solaceClient.session = null;
        }
      });

      solaceClient.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, function (sessionEvent) {
        console.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey);
      });

      solaceClient.session.on(solace.SessionEventCode.ACKNOWLEDGED_MESSAGE, function (sessionEvent) {
        console.log('Message Acknowledged By Broker');
      });

      solaceClient.session.on(solace.SessionEventCode.REJECTED_MESSAGE_ERROR, function (sessionEvent) {
        console.log('Message Rejected');
      });

      solaceClient.session.on(solace.SessionEventCode.REPUBLISHING_UNACKED_MESSAGES, function (sessionEvent) {
        console.log('Republishing Unacked Message');
      });
      solaceClient.session.on(solace.SessionEventCode.MESSAGE, function (message) {
        console.log('Received message via direct message: "' + message.getDestination().getName());
        // console.log(message.getBinaryAttachment());
        //  For subscriptions only
        // for (const [topic, callback] of Object.entries(eventHandlers.value)) {
        //     const regex = topic.replace('*', '.*').replace('>', '.*')
        //     let destinationName = message.getDestination().getName();
        //     let found = destinationName.match(regex);
        //     if (found) {
        //         callback(message)
        //     }
        // }
      });

      try {
        solaceClient.session.connect();
      } catch (error) {
        console.log(error.toString())
        reject(error)
      }

    });
  }

  function disconnect() {
    if (solaceClient.session != null) {
      solaceClient.session.disconnect();
    }
  }

  function publishMessage(topic, payload) {
    const message = solace.SolclientFactory.createMessage();
    message.setDestination(solace.SolclientFactory.createTopicDestination(topic));
    message.setDeliveryMode(MessageDeliveryModeType.PERSISTENT)
    message.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING, payload));
    message.setDMQEligible(true);

    console.log('Publishing message {} on topic {}', message, topic);
    solaceClient.session.send(message);
  }

  function sendRequest(topic, replyToDestination, payload) {

    try {
      const request = solace.SolclientFactory.createMessage();

      let userPropertyMap = request.getUserPropertyMap();

      userPropertyMap = new solace.SDTMapContainer();
      userPropertyMap.addField('aiConnectorReplyTo', solace.SDTFieldType.STRING, replyToDestination.getName())
      request.setUserPropertyMap(userPropertyMap);
      request.setDestination(solace.SolclientFactory.createTopicDestination(topic));
      request.setDeliveryMode(MessageDeliveryModeType.PERSISTENT)
      // request.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING, payload));
      console.log(payload)
      request.setBinaryAttachment(JSON.stringify(payload))
      request.setDMQEligible(true);

      console.log('Sending request on topic: ', topic);
      solaceClient.session.send(request)
    } catch (error) {
      console.log("error sending message: " + error)
    }
  }

  async function createTempReplyConsumer(queueName, replyCb) {
    return new Promise((resolve, reject) => {
      if (solaceClient.session == null) {
        reject("No solace client session");
      }

      const replyMessageConsumer = solaceClient.session.createMessageConsumer({
        queueDescriptor: { name: queueName, type: solace.QueueType.QUEUE, durable: false },
        acknowledeMode: solace.MessageConsumerAcknowledgeMode.CLIENT,
        createIfMissing: true
      });

      replyMessageConsumer.on(solace.MessageConsumerEventName.UP, function () {
        resolve(replyMessageConsumer.getDestination())
      })

      replyMessageConsumer.on(solace.MessageConsumerEventName.MESSAGE, function (message) {
        console.log('Reply Message Consumer Received Message on ' + replyMessageConsumer.getDestination());
        replyCb(message)

      })

      replyMessageConsumer.connect()

    })
  }

  async function createConsumer(queueName, topicSubscription, messageCb) {
    return new Promise((resolve, reject) => {
      if (solaceClient.session == null) {
        reject('No Solace client session');
      }

      const tempMessageConsumer = solaceClient.session.createMessageConsumer({
        queueDescriptor: { name: queueName, type: solace.QueueType.QUEUE, durable: true },
        acknowledeMode: solace.MessageConsumerAcknowledgeMode.CLIENT,
        createIfMissing: true
      })

      tempMessageConsumer.on(solace.MessageConsumerEventName.UP, function () {
        tempMessageConsumer.addSubscription(solace.SolclientFactory.createTopicDestination(topicSubscription))
      })

      tempMessageConsumer.on(solace.MessageConsumerEventName.SUBSCRIPTION_OK, function () {
        resolve(tempMessageConsumer.getDestination())
      })

      tempMessageConsumer.on(solace.MessageConsumerEventName.MESSAGE, function (message) {
        console.log('Received Message on  ' + tempMessageConsumer.getDestination());
        messageCb(message)
      })

      tempMessageConsumer.connect()
    })
  }


  return {
    connect,
    disconnect,
    publishMessage,
    sendRequest,
    createTempReplyConsumer,
    createConsumer,
  }

})
