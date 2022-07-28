import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';

export default handler => middy(handler)
                        .use([
                            httpJsonBodyParser(),
                            httpEventNormalizer(),
                            httpErrorHandler()
                        ]);
                        /*      //O analisador de corpo passara automaticamente pelo nosso corpo,tornando o codigo mais limpo, com ele removemos do const title= JSON.parse(event.body), tiramos o json.parse
                      .use(httpJsonBodyParser())
                      //ajustara automaticamente os objetos. evitando objetos inexistentes
                      .use(httpEventNormalizer())
                      //nos ajuda na manipulaç~ao de erros
                      .use(httpErrorHandler());*/