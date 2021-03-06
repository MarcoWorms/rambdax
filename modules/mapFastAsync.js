async function mapFastAsyncFn(fn,arr){
  try{
    const promised = arr.map(a => fn(a))
    return await Promise.all(promised)
  }catch(err){
    throw err
  }
  
}

function mapFastAsync(fn, arr){
   if(arr === undefined){
    return async holder => {
      return await mapFastAsyncFn(fn,holder)
    }
  }
  return new Promise((resolve,reject) =>{
    mapFastAsyncFn(fn,arr).then(resolve).catch(reject)  
  })
}

module.exports = mapFastAsync