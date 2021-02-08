const _url = "http://localhost:8081/api";
const base = "http://localhost:8081";
const _headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("token")
};

const links = {
  baseUrl: base,

  auth: {
    url: `${_url}/employees/login`,
    headers: _headers
  },
  user: {
    url: `${_url}/me`,
    headers: _headers
  },

  //CRUD USUARIOS :
  listUsers: {
    url: `${_url}/employees/list`,
    headers: _headers
  },
  deleteUserUrl(id) {
    return {
      url: `${_url}/employees/${id}/delete`,
      headers: _headers
    };
  },
  createUser: {
    url: `${_url}/employees/create`,
    headers: _headers
  },

  editUserUrl(id) {
    return {
      url: `${_url}/employees/${id}/edit`,
      headers: _headers
    };
  },

  //Crud Clients

  listNormalClients: {
    url: `${_url}/clients/list-normal`,
    headers: _headers
  },
  listBusinnesClients: {
    url: `${_url}/clients/list-enterprise`,
    headers: _headers
  },

  listAllMappeds: {
    url: `${_url}/clients/list-all-mapped`,
    headers: _headers
  },

  deleteClientUrl(id) {
    return {
      url: `${_url}/clients/${id}/delete`,
      headers: _headers
    };
  },
  createClient: {
    url: `${_url}/clients/create`,
    headers: _headers
  },

  editClientUrl(id) {
    return {
      url: `${_url}/clients/${id}/edit`,
      headers: _headers
    };
  },

  //Crud HABITACIONES

  listRooms: {
    url: `${_url}/rooms/list`,
    headers: _headers
  },

  listRoomsTypes: {
    url: `${_url}/rooms/list-types`,
    headers: _headers
  },

  deleteRoomUrl(id) {
    return {
      url: `${_url}/rooms/${id}/delete`,
      headers: _headers
    };
  },
  createRoom: {
    url: `${_url}/rooms/create`,
    headers: _headers,
    "Content-Type": "multipart/form-data"
  },

  editRoomUrl(id) {
    return {
      url: `${_url}/rooms/${id}/edit`,
      headers: _headers,
      "Content-Type": "multipart/form-data"
    };
  },

  changeStateUrl(id) {
    return {
      url: `${_url}/rooms/${id}/change-state`,
      headers: _headers
    };
  },

  //reservaciones(){
  listReservations: {
    url: `${_url}/reservations/list`,
    headers: _headers
  },

  getReservationRanges: {
    url: `${_url}/reservations/get-ranges`,
    headers: _headers
  },

  deleteReservationUrl(id) {
    return {
      url: `${_url}/reservations/${id}/delete`,
      headers: _headers
    };
  },
  createReservation: {
    url: `${_url}/reservations/create`,
    headers: _headers
  },

  editReservationUrl(id) {
    return {
      url: `${_url}/reservations/${id}/edit`,
      headers: _headers
    };
  },

  //Ofertas

  listOffers: {
    url: `${_url}/offers/list`,
    headers: _headers
  },

  deleteOfferUrl(id) {
    return {
      url: `${_url}/offers/${id}/delete`,
      headers: _headers
    };
  },
  createOffer: {
    url: `${_url}/offers/create`,
    headers: _headers,
    "Content-Type": "multipart/form-data"
  },

  editOfferUrl(id) {
    return {
      url: `${_url}/offers/${id}/edit`,
      headers: _headers,
      "Content-Type": "multipart/form-data"
    };
  },

  //type services
  listTypeService: {
    url: `${_url}/type-services/list`,
    headers: _headers
  },

  createTypeService: {
    url: `${_url}/type-services/create`,
    headers: _headers,
  },

  editTypeServiceUrl(id) {
    return {
      url: `${_url}/type-services/${id}/edit`,
      headers: _headers,
    };
  },

  //services
  listServices: {
    url: `${_url}/services/list`,
    headers: _headers
  },

  deleteServicesUrl(id) {
    return {
      url: `${_url}/services/${id}/delete`,
      headers: _headers
    };
  },
  createServices: {
    url: `${_url}/services/create`,
    headers: _headers,
  },

  editServicesUrl(id) {
    return {
      url: `${_url}/services/${id}/edit`,
      headers: _headers,
    };
  },
};

module.exports = links;
