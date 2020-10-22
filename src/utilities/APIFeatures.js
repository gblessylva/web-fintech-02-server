class APIFeatures {
    constructor(query, queryString){
        this.query = query,
        this.queryString = queryString
    }

    filtering(){
        //query = model.Find
        // queryString = this.queryString
        const queryObj = {...this.queryString}
        const excludeQuery = ['page', 'limit', 'sort'];
        excludeQuery.forEach( el=>  delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        console.log(queryStr);
        this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting(){
        if(this.queryString.sort){
            console.log('sorted')
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query= this.query
        }
        return this;
    }
    paginating(){
        const page = this.queryString.page *1 || 1;
        const limit = this.queryString.limit * 1 || 2;
        const skip = (page - 1) * 1 || 1;
        const query = this.query.skip(skip).limit(limit);
        return this;
    }



}

module.exports = APIFeatures