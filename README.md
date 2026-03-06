<h1> Whatsapp Message Scheduler Automation </h1>

<h2>This is a monorepo with two services:</h2>
<h3>API:</h3>
<p>An API that recieves requests from users to schedule messages on WhatsApp</p>
<h3>WhatsApp Worker:</h3>
<p>Uses Baileys websocket to connect to WhatsApp via QR code and send messages with the logged WhatsApp account</p>

<h2>To run the project:</h2>

<p>Clone the repository:</p>

``` 
git clone git@github.com:vNemetz/whatsapp-automation.git 
```

<p>Install the dependencies:</p>

```
npm install
```

<p>Run the API:</p>

```
npm run start:api
```

<p>Run the WhatsApp Worker:</p>

```
npm run start:worker
```
<p>Then, connect your WhatsApp into WhatsApp Worker via QR Code and you're good to go!</p>
