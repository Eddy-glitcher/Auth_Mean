const { response } = require("express");

const imgExtValidator = (req, res = response, next) => {
    const image = req.body.image;

    if(image){ 
        const validImageExtensions = ['jpg', 'jpeg', 'png', 'avif'];
        const imagePath  = image.split('.');
        const imageExt   = imagePath[imagePath.length-1].toLowerCase();
        
        if(!validImageExtensions.includes(imageExt)){
            return res.status(400).json({
                ok  : false,
                ok  : 'La imagen recibida no cumple las normas debe ser .jpg/jpeg/png/avif'
            });
        };
    }

    next();

};

module.exports = {
    imgExtValidator
};