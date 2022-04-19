const btn = document.querySelector("#btn");
const inputToSend = document.querySelector("#url");
const textResponse = document.querySelector(".response");

btn.addEventListener("click", async () => {
	if (!inputToSend.value) {
		return alert("Podaj url!");
	}
	textResponse.textContent = "Ładowanie...";
	try {
		const res = await fetch("http://10.0.0.35:8080", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: inputToSend.value }),
		});
		const json = await res.json();
		console.log(json);
		if (json?.error) {
			return (textResponse.textContent = "Invalid url!");
		}
		if (json?.url) {
			textResponse.textContent = json.url;
		}
	} catch (e) {
		textResponse.textContent = "ERROR";
		throw e;
	}
});
