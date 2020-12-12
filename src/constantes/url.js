// const _url = 'http://control_notas.test';
const _url = 'http://control.saphi.io';

const links = {
  auth : {
    url : `${_url}/api/login-admin`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  },
  user : {
    url : `${_url}/api/user`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  },
  logout : {
    url : `${_url}/api/logout`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  },
  createUserUrl :  function (role,token){
    return {
      url : `${_url}/api/users/${role}/create`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  deleteUserUrl :  function (id,token){
    return {
      url : `${_url}/api/users/${id}/delete`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  editUserUrl :  function (id,token){
    return {
      url : `${_url}/api/users/${id}/edit`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  listUsersByRol : function (role,token){
    return {
      url : `${_url}/api/users/${role}/list`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  // ---------------------------------------------------------------------
  roles : {
    url : `${_url}/api/roles`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  },
  listTeachersUrl : function(token){
    return {
      url : `${_url}/api/teachers`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  listCoursesUrl :  function (token){
    return {
      url : `${_url}/api/courses`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  listCoursesByTeacherUrl :  function (id,token){
    return {
      url : `${_url}/api/courses/${id}/list-teacher`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  createCourseUrl :  function (token) {
    return {
      url : `${_url}/api/courses/create`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  editCourseUrl :  function (id,token){
    return {
      url : `${_url}/api/courses/${id}/edit`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  deleteCourseUrl :  function (id,token){
    return {
      url : `${_url}/api/courses/${id}/delete`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
  detailCourseURl :  function (id,token){
    return {
      url : `${_url}/api/courses/${id}/detail`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    }
  },
}

module.exports = links
