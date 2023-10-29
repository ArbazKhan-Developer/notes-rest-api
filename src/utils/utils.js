class utility {

    static async parseElement(data){
        try {
            return await JSON.parse(data);
        } catch (error) {
            console.log(`error occourred while parsing data ${data}`);
            throw error;
        }
    }

    static async stringifyData(data){
        try {
            return await JSON.stringify(data);
        } catch (error) {
            console.log(`error occourred while stringify data ${data}`);
            throw error;
        }
    }
}

module.exports = utility;

