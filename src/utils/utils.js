class utility {

    static async parseElement(data){
        try {
            return await JSON.parse(data);
        } catch (error) {
            console.log(`error occourred while parsing data ${data}`);
            return data;
        }
    }

    static async stringifyData(data){
        try {
            return await JSON.stringify(data);
        } catch (error) {
            console.log(`error occourred while stringify data ${data}`);
            return data;
        }
    }
}

module.exports = utility;

