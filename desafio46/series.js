// series.js
const Router = require('koa-router');
const router = new Router({
	prefix: '/series'
});

let series = [
	{ id: 1, name: 'THE OFFICE', author: 'Ricky Gervais' },
	{ id: 2, name: 'PEAKY BLINDER', author: 'Steven Knight' },
	{ id: 3, name: 'STRANGER THINGS', author: 'Duffer Bros' },
	{ id: 4, name: 'HAWKEYE', author: 'Jonathan Igla' }

];


// ---------------------- Routes ----------------------- 
//Get All
router.get('/', (ctx, next) => {
	ctx.body = {
		status: 'success',
		message: series
	};
	next();
});

//Get x ID 
router.get('/:id', (ctx, next) => {
	let getCurrentSerie = series.filter(function(serie) {
		if (serie.id == ctx.params.id) {
			return true;
		}
	});

	if (getCurrentSerie.length) {
		ctx.body = getCurrentSerie[0];
	} else {
		ctx.response.status = 404;
		ctx.body = {
			status: 'error!',
			message: "Serie Not Found, id doesn't exists!"
		};
	}
	next();
});

//Post 
router.post('/new', (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.id ||
		!ctx.request.body.name ||
		!ctx.request.body.author
	) {
		ctx.response.status = 400;
		ctx.body = {
			status: 'error',
			message: 'Please enter the data'
        }
	} else {
		let newSerie = series.push({
			id: ctx.request.body.id,
			name: ctx.request.body.name,
			author: ctx.request.body.author
		});
		ctx.response.status = 201;
		ctx.body = {
			status: 'success',
			message: `New serie added with id: ${ctx.request.body.id} & name: ${
				ctx.request.body.name
			}`
		};
	}
	next();
});

//Put 
router.put('/update/:id', (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.id ||
		!ctx.request.body.name ||
		!ctx.request.body.author
	) {
		ctx.response.status = 400;
		ctx.body = {
			status: 'error',
			message: 'Please enter the data'
        }
	} else {
        let id = ctx.params.id
        let index = series.findIndex(serie => serie.id == id)
		series.splice(index,1,ctx.request.body)
		ctx.response.status = 201;
		ctx.body = {
			status: 'success',
			message: `New serie updated with id: ${ctx.request.body.id} & name: ${
				ctx.request.body.name
			}`
		};
	}
	next();
});

//Delete 
router.delete('/delete/:id', (ctx, next) => {
    let id = ctx.params.id
	let index = series.findIndex(serie => serie.id == id)
    series.splice(index,1)
    ctx.response.status = 200;
    ctx.body = {
        status: 'success',
        message: "Serie deleted"
    };
	next();
});


module.exports = router;