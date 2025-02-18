import dotenv from "dotenv";

dotenv.config();

let fileData = await Bun.file('inputSample/input.json').text()
let maxPageSize = 24
let apiTextSearchLimit = 5;
let apiConfig = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.token}`
    }
}
//gets from input
let mediaType = process.argv[2] || "movies"

await DeeplinkSearchFilter()
async function DeeplinkSearchFilter() {
    let output: any[] = []
    var contentLinks = fileData.split("\r\n").map((item) => { 
        item.split(" ").forEach((word) => {
            if(word.includes("https")) {
                console.log(word)
                item = word
                return word
            }
        })
        return item
    });
    
    let count = 0;
    
    for (let i = 0; i < contentLinks.length; i++) {
        let contentLink = contentLinks[i]
        let apiLink = `https://${process.env.baseUrl}.com/guide/api/${process.env.apiGuideVersion}/${process.env.brandSlug}/web/${mediaType}/`
        let apiSlugSplit = contentLink.split("/")
        let apiSlug = apiSlugSplit[apiSlugSplit.length - 1] ? apiSlugSplit[apiSlugSplit.length - 1] : apiSlugSplit[apiSlugSplit.length - 2]
        apiLink += apiSlug
        console.log(`searching for ${apiLink}`)

        await fetch(apiLink, apiConfig)
        .then(response => response.json())
        .then(data => {
            console.log(`found ${data.name} with id ${data.id}`)
            
            let dataOut = data;
            let dataStruct = {
                id: count++,
                slugId: dataOut.id,
                title: dataOut.name,
                slug: dataOut.slug,
                link: `https://${process.env.stagingUrl}.com/admin/guide/${mediaType == "movies" ? "movie" : "shows"}/${dataOut.id}`
            }
            output.push(dataStruct)
        })
        .catch((error) => {
            console.error(error);
        });
    }


    let baseApiUrlList = output.map((item) => item.link)
    
    //create the js launch script for this
    let launchScript = `
    let x = ${JSON.stringify(baseApiUrlList)};
    for(let i = 0; i < x.length - 1; i++) {
        let curr = x[i];
        window.open(curr, "_blank");
    }`.trim().replaceAll('"', "'").replaceAll("\n", "");
    output.push(launchScript);
    Bun.write("outputSample/output.json", JSON.stringify(output, null, 4));
    console.log("wrote to outputSample/output.json")
}