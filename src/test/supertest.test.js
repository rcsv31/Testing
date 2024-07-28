//Instalar supertest: npm i -D supertest
//Actualizar el script test

//Importar el supertest
import supertest from "supertest";

//Importar chai
import { expect } from "chai";

//Crear una varibale que se va a llamar "requester" que se encargará de hacer las peticiones al servidor
const requester = supertest("http://localhost:3000");

//Ahora vamos a trabajar con dos "describe" uno hace referencia a la app y el otro para cada entidad interna que vamos a ir testeando
describe("Testeamos de la web", () => {
  describe("Testing de los productos:", () => {
    it("Endpoint POST /api/products", async () => {
      //Creo un producto mock
      const productMock = {
        title: "Mock",
        description: "Mock",
        price: 100,
        stock: 5,
        category: "Mock",
        status: true,
        code: "mock",
        img: "mock",
        thumbnail: "mock",
      };
      const { statusCode, ok, body } = await requester
        .post("/api/products")
        .send(productMock);
      //En cada prueba puede recibir el ok, el statusCode y el body

      //Mostramos por consola
      console.log(statusCode);
      console.log(ok);
      console.log(body);

      //Evaluamos:
      expect(body.payload).to.have.a.property("_id");
    });
  });

  //test 2
  describe("Test Avanzado", () => {
    //Declaramos de forma global una variable cookie que voy a usar en las pruebas
    let cookie;
    it("Debe registrar correctamente a un usuario", async () => {
      const mockUsuario = {
        first_name: "Mock",
        last_name: "Mock",
        email: "mock@mock.es",
        password: "1234",
      };
      const { body } = await requester
        .post("api/sessions/register")
        .send(mockUsuario);

      //Validamos que tenga un payload
      expect(body.payload).to.be.ok;
      // console.log(body.payload);
    });
    id("Debe iniciar sesion correctamente y recuperar la cookie", async () => {
      //Enviamos al login lso mismos datos que registramos en el paso anteior
      const usuarioLogin = {
        email: "mock@mock.es",
        password: "1234",
      };
      const resultado = await requester
        .post("api/sessions/login")
        .send(usuarioLogin);

      //Resultado es la respuesta que mda requeter. Voy a buscar del resultado los headers de la peticion
      const cookieResultado = resultado.headers["set-cookie"]["0"];
      //Podemos verificar que la cookie recuperada exista:
      expect(cookieResultado).to.be.ok;

      //Separamos el nombre y el valor de la cookie recuperada
      cooki = {
        name: cookieResultado.split("=")[0],
        value: cookieResultado.split("=")[1],
      };
      //Verficamos que los datos recuperados sean correctos
      expect(cookie.name).to.be.ok.and.equal("coderCookie");
      expect(cookie.value).to.be.ok;
    });
    //Probamos ruta current:
    it("Debe enviar la cookie que contiene el usuario", async () => {
      //Ingresamos la ruta currente enviado la cookie
      const body = await requester
        .get("api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      //Verificamos
      expect(body.payload.email).to.be.equal("mock@mock.es");
    });
  });

  //Testing carga de imagenes
  describe: "Testing de la carga de imagenes",
    () => {
      it("Tenemos que crear un productos con una imagen", async () => {
        const productsMock = {
          title: "Mock",
          description: "Mock",
          price: 100,
          stock: 5,
          category: "Mock",
          status: true,
          code: "mock",
        };
        //Ahora ya no usamos el metodo send, sino que usamos field, para los distintos campos
        const resultado = await requester
          .post("/api/products/withimage")
          .field("title", produtsMock.title)
          .field("description", productsMock.description)
          .field("category", productsMock.category)
          .field("price", productsMock.price)
          .field("stock", productsMock.stock)
          .field("code", productsMock.code)
          .attach("img", "./src/public/imag/imagenPruebaText.jpg");

        //Verificamos que la peticion resulte existosa
        expect(resultado.status).to.be.equal(200);

        //Verificamos que el producto tenga un id
        expect(resultado.body.payload).to.have.a.property("_id");
      });
    };
});
