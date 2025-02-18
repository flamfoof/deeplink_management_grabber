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
    var titles = fileData.split("\r\n");
    let count = 0;
    
    for (let i = 0; i < titles.length; i++) {
        let apiLink = `https://${process.env.baseUrl}.com/search/api/${process.env.searchVersion}/web/search_by_type/${mediaType}?page=1&page_size=${maxPageSize}&q=`
        let titleChain = ""
        let titleList = []
        for(let j = 0; j < apiTextSearchLimit; j++) {
            let currTitle = titles[i]
            titleList.push(currTitle)
            i++;
            titleChain += currTitle + (j == apiTextSearchLimit - 1 ? "" : " | ")
        }

        apiLink += titleChain;
        await fetch(apiLink, apiConfig)
        .then(response => response.json())
        .then(data => {
            let dataOut = data.results;
            for(let j = 0; j < titleList.length; j++) {
                let currTitle = titleList[j]
                for(let k = 0; k < dataOut.length; k++) {
                    let apiData = dataOut[k]
                    if(apiData.name == currTitle) {
                        let dataStruct = {
                            id: count++,
                            slugId: apiData.id,
                            title: apiData.name,
                            slug: apiData.slug,
                            link: `https://${process.env.stagingUrl}.com/admin/guide/${mediaType == "movies" ? "movie" : "shows"}/${apiData.id}`
                        }
                        output.push(dataStruct)
                        break;
                    }
                }
            }
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