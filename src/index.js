const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const getCpuInformationCores = () => {
  let str = '';
  const arrCpus = os.cpus();
  arrCpus.forEach((cpu) => {
    str += `<li>${cpu.model}: ${cpu.speed}</li>`;
  });

  return `${str} \n ${arrCpus.length}`;
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');
    const cpuInformation = getCpuInformationCores();

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<h1>Explorando os Protocolos 🧐🔎</h1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">${locationData.region}</p>`);
      socket.write(`<p data-testid="country">${locationData.country_name}</p>`);
      socket.write(`<p data-testid="company">${locationData.company}</p>`);
      socket.write('<h1>Devinces</h1>');
      socket.write(`<p data-testid="device">${device}</p>`);
      socket.write('<h1>Operation System</h1>');
      socket.write(`<p data-testid="arch">${os.arch()}</p>`);
      socket.write(`<ul data-testid="cpu">${cpuInformation}</ul>`);
      socket.write(`<p data-testid="memory">${os.totalmem()}</p>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
