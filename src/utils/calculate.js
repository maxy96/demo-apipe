module.exports = {
    calculatePrice: function(distanceNro){
        if(distanceNro <= 1.0)
            return 70;    
        
        const result = distanceNro * 10 - 10;
        return distanceNro < 3.8 ? result * 5 + 70
                                 : result * 2.5 + 137.5;
    }
}