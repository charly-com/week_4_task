import fs from 'fs';
import got from 'got';
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
  const validDomainArray: string[] = [];
  let emailsWithValidDomains = '';

  for (let i = 0; i < inputPath.length; i++) {
    try {
      const data = fs.createReadStream(inputPath[i]);

      for await (const chunk of data) {
        emailString += chunk;
      }
      emailString = emailString.toString();
      emailArray = emailString.split('\n');
    } catch (error) {
      console.log(error);
    }
    const regx = new RegExp(
      /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    );
    for (const item of emailArray) {
      if (regx.test(item)) {
        validEmails.push(item);
      }
    }

    for (const item of validEmails) {
      const domain = item.split('@')[1];

      const url = `https://dns.google.com/resolve?name=${domain}&type=MX`;
      const response = await got(url);
      const result = JSON.parse(response.body);
      if (result.Answer && !validDomainArray.includes(domain)) {
        validDomainArray.push(domain);
        const realEmail = `${item}\n`;
        // console.log(realEmail);
        emailsWithValidDomains += realEmail;
      }
    }

    // console.log(emailsWithValidDomains);
    const writerStream = fs.createWriteStream(outputFile);
    writerStream.write(emailsWithValidDomains, 'utf8');
    writerStream.end;
    writerStream.on('finish', function () {
      console.log('Write completed.');
    });

    writerStream.on('error', function (err) {
      console.log(err.message);
    });
  }
}

export default validateEmailAddresses;
