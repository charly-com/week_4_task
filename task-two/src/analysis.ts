import fs from 'fs';

/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */

async function analyseFiles(inputPaths: string[], outputPath: string) {
  const tests = fs.createReadStream(inputPaths[0], { encoding: 'utf-8' });
  //to extract the email addresses and store in empty string('data')
  let data = '';
  for await (const test of tests) {
    data += test;
  }
  const newData = data.trim().split('\n');
  newData.shift();
  const length = newData.length;

  //validating the emails
  const filteredEmail: Array<string> = [];
  const regx = new RegExp(
    /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  );
  for (let i = 0; i < newData.length; i++) {
    if (regx.test(newData[i])) {
      filteredEmail.push(newData[i]);
    }
  }

  const length2 = filteredEmail.length;
  //to extract the domain name
  const validDomainNames: string[] = [];
  for (const elem of filteredEmail) {
    const domains = elem.split('@')[1];
    validDomainNames.push(domains);
  }
  //to get the count of each domain name
  const domainCount: { [key: string]: number } = {};
  for (const i of validDomainNames) {
    if (domainCount[i]) {
      domainCount[i]++;
    } else {
      domainCount[i] = 1;
    }
  }

  //collate my data
  const finalOutput: Record<string, unknown> = {
    ' valid-domains': validDomainNames,
    ' totalEmailsParsed': length,
    ' totalValidEmails': length2,
    ' categories': domainCount,
  };

  fs.writeFile(outputPath, JSON.stringify(finalOutput), 'utf-8', (err) => {
    if (err) console.log(err);
    else console.log('file written');
  });
}

export default analyseFiles;
