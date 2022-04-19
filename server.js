const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const uri =
	"mongodb+srv://AdminKamilo:I1udrg12@cluster0.8from.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
	console.log(`it's alive on http://localhost:${PORT}`);
});

const isValidHttpUrl = (string) => {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
};

app.post("/", async (req, res) => {
	const { url } = req.body;
	if (!url || !isValidHttpUrl(url)) {
		console.log("Url error");
		return res.send({
			error: "Url error",
		});
	}
	const clientDb = await MongoClient.connect(uri, {
		useNewUrlParser: true,
	}).catch((err) => {
		console.log(err);
	});
	if (!clientDb) {
		return;
	}
	try {
		const db = clientDb.db("shorter");
		const collection = db.collection("links");
		const id = ObjectId().toString().slice(-6);
		await collection.insertOne({
			_id: id,
			longUrl: url,
		});
		res.send({
			url: `http://localhost:8080/${id}`,
		});
	} catch (err) {
		console.log(err);
		throw err;
	} finally {
		clientDb.close();
	}
});

app.get("/:id", async (req, res) => {
	const { id } = req.params;
	const clientDb = await MongoClient.connect(uri, {
		useNewUrlParser: true,
	}).catch((err) => {
		console.log(err);
	});
	if (!clientDb) {
		return;
	}
	try {
		const db = clientDb.db("shorter");
		const collection = db.collection("links");
		const url = await collection.findOne({ _id: id });
		if (!url) {
			return res.end("Error url!");
		}
		res.redirect(url?.longUrl);
	} catch (err) {
		console.log(err);
		throw err;
	} finally {
		clientDb.close();
	}
});
