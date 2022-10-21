import fs from 'fs';
import dns from 'dns';
/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  let emailString = '';
  let emailArray: string[] = [];
  const validEmails: string[] = [];

  for (let i = 0; i < inputPath.length; i++) {
    const data = fs.createReadStream(inputPath[i]);

    for await (const chunk of data) {
      emailString += chunk;
    }
    emailString = emailString.toString();
    emailArray = emailString.split('\n');

    const regx = new RegExp(
      /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    );
    for (const item of emailArray) {
      if (regx.test(item)) {
        validEmails.push(item);
      }
    }
  }
  const output = fs.createWriteStream(outputFile);
  output.write('Email' + '\n');
  for (const elem of validEmails) {
    const domains = elem.split('@')[1];

    dns.resolve(domains, 'MX', function (err, addresses) {
      if (err) {
        console.log(elem);
      } else if (addresses && addresses.length > 0) {
        output.write(elem + '\n');
      }
    });
  }
}

export default validateEmailAddresses;
