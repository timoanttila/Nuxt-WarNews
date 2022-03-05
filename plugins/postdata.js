const postData = async function (query) {
	const result = await fetch(`https://api.warnews.info/?${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	});
	try {
		if (result.ok) {
			return await result.json()
		}
		else {
			return result.status;
		}
	} catch (err) {
		return err;
	}
}

export default ({ app }, inject) => {
	inject("post", query => postData(query));
}