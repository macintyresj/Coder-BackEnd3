import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const series =  [
	{ id: 1, name: 'THE OFFICE', seasons: 9, author: 'Ricky Gervais' },
	{ id: 2, name: 'PEAKY BLINDER', seasons: 6, author: 'Steven Knight' },
	{ id: 3, name: 'STRANGER THINGS', seasons: 4, author: 'Duffer Bros' },
	{ id: 4, name: 'HAWKEYE', seasons: 1, author: 'Jonathan Igla' }

];

const router = new Router();
router
  .get('/', (ctx: any)=>{
    ctx.response.body = series;
  })

  .get('/:id', (ctx: any)=>{
    const serie = series.filter((el)=>{
      if (el.id === ctx.params.id) {
          return true
      }
    });

    if (serie.length) {
        ctx.response.body = serie[0]
    } else {
        ctx.response.status = 404
        ctx.response.body = {
            status: 'error!',
            message: "Serie Not Found, id doesn't exists!"
        }
    }
  })

  .post('/', async (ctx: any)=>{
    const body = ctx.request.body({type: "json"});
    const { id, name, seasons, author } = await body.value;

    if ( !id || !name || !seasons || !author ) {
      ctx.response.status = 400,
      ctx.response.body = {
          status: 'error',
          message: 'You forgot some value',
      }
    } else {
      const newProduct = series.push({
        id,
        name,
        seasons,
        author
      });
      ctx.response.status = 201,
      ctx.response.body = {
          status: 'success',
          message: `Serie created`,
      };
    }
  })

  .put('/:id', async (ctx: any)=>{
    const body = ctx.request.body({type: "json"});
    const { id, name, seasons, author } = await body.value;

    if ( !id || !name || !seasons || !author ) {
      ctx.response.status = 400
      ctx.response.body = {
          status: 'error',
          message: 'You forgot some value'
      }
    } else {
      const param = ctx.params.id
      const index = series.findIndex(prod => prod.id === param)
      const newData = {id, name, seasons, author}

      series.splice(index, 1, newData)

      ctx.response.status = 201
      ctx.response.body = {
          status: 'success',
          message: 'Serie was updated'
      }
    }
  })
  
  .delete('/:id', (ctx: any)=>{
    const id = ctx.params.id
    const index = series.findIndex(prod => prod.id === id)
    series.splice(index, 1)

    ctx.response.status = 200
    ctx.response.body = {
        status: 'success',
        message: 'serie deleted'
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });