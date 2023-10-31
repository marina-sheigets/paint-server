const fs = require('fs');
const path = require('path');

class Image {
	saveImg(req, res) {
		try {
			const data = req.body.img.replace('data:image/png;base64,', '');
			const targetPath = __dirname.replace('services', '');
			fs.writeFileSync(
				path.resolve(targetPath, 'files', `${req.query.id}.jpg`),
				data,
				'base64'
			);
			return res.status(200).json('OK');
		} catch (error) {
			console.log(error);
			return res.status(500).json('Something went wrong');
		}
	}

	getImg(req, res) {
		try {
			const targetPath = __dirname.replace('services', '');
			const file = fs.readFileSync(path.resolve(targetPath, 'files', `${req.query.id}.jpg`));
			const data = 'data:image/png;base64,' + file.toString('base64');
			return res.status(200).json(data);
		} catch (error) {
			console.log(error);
			return res.status(500).json('Something went wrong');
		}
	}
}
module.exports = { default: new Image() };
