const { PDFNet } = require('@pdftron/pdfnet-node');

class PDFService{
    replaceImage(inputFilePath, outputFilePath, imageFilePath){
        return new Promise((resolve, reject) =>{
            PDFNet.runWithCleanup(async ()=>{
                try{
                    await PDFNet.initialize();
                    const doc = await PDFNet.PDFDoc.createFromFilePath(inputFilePath);
                    doc.initSecurityHandler();
                    const replacer = await PDFNet.ContentReplacer.create();
                    const page = await doc.getPage(1);
                    const img = await PDFNet.Image.createFromFile(doc, imageFilePath);
                    const region = await page.getMediaBox();
                    await replacer.addImage(region, await img.getSDFObj());
                    await replacer.process(page);
                    await doc.save(outputFilePath, PDFNet.SDFDoc.SaveOptions.e_linearized);
                }catch(e){
                    console.log(e);
                }
            })
            .then(() => {
                PDFNet.shutdown();
                resolve();
            }).catch(reject);
        });
    }
    //text replacement and other useful manipulations are also plausible, but not implemented
}

module.exports.PDFService = PDFService;