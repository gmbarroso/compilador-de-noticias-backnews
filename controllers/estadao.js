var ObjectID = require('mongodb').ObjectID;
var request = require('request');
var parseString = require('xml2js').parseString;


// listar
exports.listar = function (req, res) {
  req.db.collection('estadao').find().toArray(function(err, result) {
    if (err) {
      return console.log(err)
    };

   res.send(result);
  });
}

exports.criar = function (req, res) {
  request('http://www.estadao.com.br/rss/ultimas.xml', {encoding:'latin1'}, function (error, response, body){


    parseString(body, function (err, result) {

      for(var i in result.rss.channel[0].item){
        var itemAtual = result.rss.channel[0].item[i];

        var objeto = {
          titulo: itemAtual.title[0],
          desc: stripHtml(itemAtual.description[0]),
          link: itemAtual.link[0],
          _id: itemAtual.link[0],
          dataCriacao: new Date()
        }

        req.db.collection('estadao').save(objeto, function(err, result) {
          if (err) {
            return res.sendStatus(503);
          }
        });
        // res.send(result.rss.channel[0]);

      }



      res.sendStatus(201);
    });
  });
};

function stripHtml(text) {
  return text.replace(/<.*?>/g, '');
}
