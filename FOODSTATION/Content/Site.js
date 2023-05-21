﻿
// Home-Page

var gitbillConfirm = function () {
    $.ajax({
        type: "Get",
        url: "/Home/GetBill",
        success: function (items) {
            $('#_billItems').html(items);
            $("#Modal-billItems").modal('show');
        }
    });
};

// Upload picture to show   

var loadFile = function (str, event) {
    var image = document.getElementById(str)
    image.src = URL.createObjectURL(event.target.files[0]);
};

// Reset filds whene cancel add    

var resetFilds = function (form,img, event) {
    const ResetForm = document.getElementById(form);
    ResetForm.reset();
    if (img != "") {
        var ImgUrl = document.getElementById(img);
        ImgUrl.src = "";
    }
};


//#region Searsh Function

function Searsh(tableName) {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById(tableName);
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

//#endregion Searsh Function

//#region _BillPartial

var DeleteItem = function (_id) {
    $.ajax({
        type: "Post",
        url: "/Home/DeleteItemFromBill",
        data: { id: _id },
        success: function (result) {
            document.getElementById("BasketId").click();
            return false;
        }
    });
};

var IncreasQuantity = function (_id) {
    $.ajax({
        type: "Post",
        url: "/Home/IncreasQuantity",
        data: { id: _id },
        success: function (result) {
            $.ajax({
                url: "/Home/Refreash",
                contentType: 'application/html; charset=utf-8',
                type: 'GET',
                dataType: 'html',
                success: (function (result) {
                    $('#_BillPartial').html(result);
                })
            });
           // document.getElementById("BasketId").click();
            return false;
        }
    });
};
var decreasQuantity = function (_id) {
    $.ajax({
        type: "Post",
        url: "/Home/decreasQuantity",
        data: { id: _id },
        success: function (result) {
            document.getElementById("BasketId").click();
            return false;
        }
    });
};



//#endregion _BillPartial

//#region custom function for Sweet massage
function TestSweetAlert(massage) {
    swal({
        //  title: title,
        text: massage,
        content: true,
        // icon: "info", /*"success"  "erroe"*/
        className: 'swal-IW',
        //timer: 1300,
        buttons: false,
    });
};

//#endregion custom function for Sweet massage

//#region Country-Dashboard

var EditCountryConfirm = function (_id) {
    $("#Modal-countryEdit").modal('show');
    $("#ECname").val(document.getElementById('CountryName+' + _id).value)
    $("#CountryId").val(_id)
};


var DeleteCountryConfirm = function (_id) {
    $.ajax({
        type: "Post",
        url: "/Countries/DeleteConfirmed",
        data: { id: _id },
        success: function (message) {
            if (message == "") {
                $.ajax({
                    url: '/Countries/Refreash',
                    contentType: 'application/html; charset=utf-8',
                    type: 'GET',
                    dataType: 'html',
                    success: (function (result) {
                        $('#_CountryPartial').html(result);
                    })
                });
            } else if (message == "haveItem") {
                swal({
                    // title: "Are you sure?",
                    text: "هذا الدولة مرتبطة بعدد من المناطق هل تريد بالفعل حذفها",
                    className: 'swal-IW',
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((result) => {
                    if (result == true) {
                        $.ajax({
                            type: 'GET',
                            url: '/Countries/DeleteCountryAndRegions',
                            data: { id: _id },
                            contentType: 'application/html; charset=utf-8',
                            dataType: 'html',
                            success: (function (result) {
                                $.ajax({
                                    url: '/Countries/Refreash',
                                    contentType: 'application/html; charset=utf-8',
                                    type: 'GET',
                                    dataType: 'html',
                                    success: (function (result) {
                                        $('#_CountryPartial').html(result);
                                    })
                                });
                            })
                        })
                    }
                });
            }
        },
    });
    return false;
};

$(document).ready(function () {

    $("#btnCreateCountry").click(function () {
    if ($("#CCname").val() == "") {
        TestSweetAlert("قم بأدخال الأسم");
    } else {
        var formdata = new FormData;
        formdata.append("Name", $("#CCname").val());
        $.ajax({
            async: true,
            type: "POST",
            dataType: "JSON",
            url: "/Countries/Create",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    $.ajax({
                        url: '/Countries/Refreash',
                        contentType: 'application/html; charset=utf-8',
                        type: 'GET',
                        dataType: 'html',
                        success: (function (result) {
                            $('#_CountryPartial').html(result);
                            var close = document.getElementById('btnCreateColse');
                            close.click();
                        })
                    });
                } else {
                    TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                }
            }
        });
    }
    
    return false;
});

    $("#btnEditCountry").click(function () {
        if ($("#ECname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else {
            var formdata = new FormData;
            formdata.append("Id", $("#CountryId").val());
            formdata.append("Name", $("#ECname").val());
            $.ajax({
                async: true,
                type: "POST",
                dataType: "JSON",
                url: "/Countries/Edit",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result) {
                        $.ajax({
                            url: '/Countries/Refreash',
                            contentType: 'application/html; charset=utf-8',
                            type: 'GET',
                            dataType: 'html',
                            success: (function (result) {
                                $('#_CountryPartial').html(result);
                                var close = document.getElementById('btnEditColse');
                                close.click();
                            })
                        });
                    } else {
                        TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                    }
                }
            });
        }
        return false;
    });
        
});
    

//#endregion Country-Dashboard

//#region  Region-Dashboard

$("#btnRegionCreate").click(function () {
    if ($("#CRname").val() == "") {
        TestSweetAlert("قم بأدخال اسم المنطقة");
    } else {
        var formdata = new FormData;
        formdata.append("Name", $("#CRname").val());
        formdata.append("CountryId", $("#RCountryId").val());
        $.ajax({
            async: true,
            type: "POST",
            dataType: "JSON",
            url: "/Regions/Create",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    $.ajax({
                        url: '/Regions/Refreash',
                        contentType: 'application/html; charset=utf-8',
                        type: 'GET',
                        dataType: 'html',
                        success: (function (result) {
                            $('#_RegionPartial').html(result);
                            var close = document.getElementById('btnCreateColse');
                            close.click();
                        })
                    });
                } else {
                    TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                }
            }
        });
    }
    return false;
});

//#Delete Region 

var DeleteRegionConfirm = function (_id) {
    $("#RegionId").val(_id)
    $("#Modal-RegionDelete").modal('show');

};

$("#btnRegionDelete").click(function () {
    var RegionId = $("#RegionId").val();
    $.ajax({
        type: "Post",
        url: "/Regions/DeleteConfirmed",
        data: { id: RegionId },
        success: function (result) {
            if (result) {
                $("#Modal-RegionDelete").modal('hide');
                $("#RegionId").val(null);
                $.ajax({
                    url: '/Regions/Refreash',
                    contentType: 'application/html; charset=utf-8',
                    type: 'GET',
                    dataType: 'html',
                    success: (function (result) {
                        $('#_RegionPartial').html(result);
                    })
                })
            } else {
                TestSweetAlert("حذث خطا ما أثناء عملية الحدف ");
            }
        }
    });
})

var EditRegionConfirm = function (_id) {
    $("#RegionId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Regions/GetRegion",
        data: { id: _id },
        success: function (region) {
            $("#Modal-regionEdit").modal('show');
            $("#ERname").val(region.Name)
            $("#ERCountryId").val(region.CountryId)
            $("#hiddenId").val(_id)
        }
    });
};

$("#btnRegionEdit").click(function () {
    var formdata = new FormData;
    formdata.append("Id", $("#hiddenId").val());
    formdata.append("Name", $("#ERname").val());
    formdata.append("CountryId", $("#ERCountryId").val());
    $.ajax({
        async: true,
        type: "POST",
        dataType: "JSON",
        url: "/Regions/Edit",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result) {
                $.ajax({
                    url: '/Regions/Refreash',
                    contentType: 'application/html; charset=utf-8',
                    type: 'GET',
                    dataType: 'html',
                    success: (function (result) {
                        $('#_RegionPartial').html(result);
                        var close = document.getElementById('btnEditColse');
                        close.click();
                    })
                });
            } else {
                TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
            }
        }
    });

});

//#endregion region-Dashboard

//#region Restaurant-Dashboard

// Edit Action

var EditRestaurantConfirm = function (_id) {
    $("#RestaurantId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Restaurants/GetRestaurant",
        data: { id: _id },
        success: function (restaurant) {
            $("#Modal-restaurantEdit").modal('show');
            $("#ERname").val(restaurant.Name)
            $("#ERdescription").val(restaurant.Description)
            $("#ERregion").val(restaurant.RegionId)
            document.getElementById('ERimgUrl').src = "/Uploads/Restaurants/" + restaurant.ImgUrl;
            $("#hiddenId").val(_id)
            $("#hiddenImgUrl").val(restaurant.ImgUrl)
        }
    });
};

// Delete Action

var DeleteRestaurantConfirm = function (_id) {
    $("#RestaurantId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Restaurants/GetRestaurant",
        data: { id: _id },
        success: function (Restaurant) {
            $("#Modal-restaurantDelete").modal('show');
            $("#DRname").val(Restaurant.Name)
            $("#DRdescription").val(Restaurant.Description)
            $("#DRregion").val(Restaurant.Region)
            document.getElementById('DRimgUrl').src = "/Uploads/Restaurants/" + Restaurant.ImgUrl;
        }
    });
};


$(document).ready(function () {

    $("#btnRestaurantCreate").click(function () {
        if ($("#CRname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else if ($("#CRdescription").val() == "") {
            TestSweetAlert("قم بأدخال الوصف");
        } else if ($("#CRpicture").val() == "") {
            TestSweetAlert("قم بأضافة صورة لمطعم");
        } else {
            var fileInput = document.getElementById('CRpicture');
            $.ajax({
                type: "Get",
                url: "/Restaurants/IsImageExist",
                data: { upload: fileInput.files[0].name },
                success: function (Message) {
                    if (Message == "") {
                        var image = $("#CRpicture").get(0).files;
                        var formData = new FormData($("#CreateRestaurantForm")[0]);
                        $.ajax({
                            async: true,
                            type: "POST",
                            dataType: "JSON",
                            url: "/Restaurants/Create",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                if (result) {
                                    $.ajax({
                                        url: '/Restaurants/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_RestaurantPartial').html(result);
                                            var close = document.getElementById('btnCreateColse');
                                            close.click();
                                        })
                                    });
                                } else {
                                    TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                                }
                            }
                        });
                    } else {
                        TestSweetAlert(Message);
                    }
                }
            });
        }
        return false;
    });

    $("#btnRestaurantEdit").click(function () {
        if ($("#ERname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else if ($("#ERdescription").val() == "") {
            TestSweetAlert("قم بأدخال الوصف");
        } else if ($("#ERpicture").val() != "") {
            var fileInput = document.getElementById('ERpicture');
            $.ajax({
                type: "Get",
                url: "/Restaurants/IsImageExist",
                data: { upload: fileInput.files[0].name },
                success: function (Message) {
                    if (Message == "") {
                        var image = $("#ERpicture").get(0).files;
                        var formdata = new FormData;
                        formdata.append("Id", $("#hiddenId").val());
                        formdata.append("Name", $("#ERname").val());
                        formdata.append("Description", $("#ERdescription").val());
                        formdata.append("ImgUrl", $("#hiddenImgUrl").val());  ///
                        formdata.append("RegionId", $("#ERregion").val())
                        formdata.append("upload", image[0]);
                        $.ajax({
                            async: true,
                            type: "POST",
                            dataType: "JSON",
                            url: "/Restaurants/Edit",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                debugger;
                                if (result) {
                                    $.ajax({
                                        url: '/Restaurants/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_RestaurantPartial').html(result);
                                            var close = document.getElementById('btnEditColse');
                                            close.click();
                                        })
                                    });
                                } else {
                                    TestSweetAlert("حدث خطأما أثناء عملية التعديل تاكد من تعديل الحقول بالشكل الصحيح وحاول مرة أخرى");
                                }
                            }
                        });
                    } else {
                        TestSweetAlert(Message);
                    }
                }
            });
        } else {
            var formdata = new FormData;
            formdata.append("Id", $("#hiddenId").val());
            formdata.append("Name", $("#ERname").val());
            formdata.append("Description", $("#ERdescription").val());
            formdata.append("ImgUrl", $("#hiddenImgUrl").val());
            formdata.append("RegionId", $("#ERregion").val())
            $.ajax({
                async: true,
                type: "POST",
                dataType: "JSON",
                url: "/Restaurants/Edit",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result) {
                        $.ajax({
                            url: '/Restaurants/Refreash',
                            contentType: 'application/html; charset=utf-8',
                            type: 'GET',
                            dataType: 'html',
                            success: (function (result) {
                                $('#_RestaurantPartial').html(result);
                                var close = document.getElementById('btnEditColse');
                                close.click();
                            })
                        });
                    } else {
                        TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                    }
                }
            });

        }
        return false;
    });

    $("#btnRestaurantDelete").click(function () {
        var RestaurantId = $("#RestaurantId").val();
        $.ajax({
            type: "Post",
            url: "/Restaurants/DeleteConfirmed",
            data: { id: RestaurantId },
            success: function (message) {
                if (message == "") {
                    $("#Modal-restaurantDelete").modal('hide');
                    $("#RestaurantId").val(null);
                    $.ajax({
                        url: '/Restaurants/Refreash',
                        contentType: 'application/html; charset=utf-8',
                        type: 'GET',
                        dataType: 'html',
                        success: (function (result) {
                            $('#_RestaurantPartial').html(result);
                        })
                    })
                } else if (message == "haveItem") {
                    swal({
                        // title: "Are you sure?",
                        text: "هذا المطعم مرتبط بعدد من العناصر هل تريد بالفعل حذفه",
                        className: 'swal-IW',
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((result) => {
                        if (result == true) {
                            $("#Modal-restaurantDelete").modal('hide');
                            $("#RestaurantId").val(null);
                            debugger;
                            $.ajax({
                                type: 'GET',
                                url: '/Restaurants/DeleteRestaurantandItems',
                                data: { id: RestaurantId },
                                contentType: 'application/html; charset=utf-8',
                                dataType: 'html',
                                success: (function (result) {
                                    $.ajax({
                                        url: '/Restaurants/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_RestaurantPartial').html(result);
                                        })
                                    })
                                })
                            })
                        } else {
                            $("#Modal-restaurantDelete").modal('hide');
                            $("#RestaurantId").val(null);
                        }
                    });
                }
            },
        });
        return false;
    });
});

//#endregion Restaurant-Dashboard

//#region Category-Dashboard

 //Edit Action

var EditCategoryConfirm = function (_id) {
    $("#CategoryId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Categories/GetCategory",
        data: { id: _id },
        success: function (category) {
            $("#Modal-categoryEdit").modal('show');
            $("#ECatname").val(category.Name)
            document.getElementById('ECatimgUrl').src = "/Uploads/Categories/" + category.ImgUrl;
            $("#hiddenId").val(_id)
            $("#hiddenImgUrl").val(category.ImgUrl)
        }
    });
};

 //Delete Action

var DeleteCategoryConfirm = function (_id) {
    $("#CategoryId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Categories/GetCategory",
        data: { id: _id },
        success: function (Category) {
            $("#Modal-categoryDelete").modal('show');
            $("#DCatname").val(Category.Name)
            document.getElementById('DCatimgUrl').src = "/Uploads/Categories/" + Category.ImgUrl;
        }
    });
};


$(document).ready(function () {

    $("#btnCategoryCreate").click(function () {
        if ($("#CCatname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else if ($("#CCatpicture").val() == "") {
            TestSweetAlert("قم بأضافة صورة لمطعم");
        } else {
            var fileInput = document.getElementById('CCatpicture');
            $.ajax({
                type: "Get",
                url: "/Categories/IsImageExist",
                data: { upload: fileInput.files[0].name },
                success: function (Message) {
                    if (Message == "") {
                        var image = $("#CCatpicture").get(0).files;
                        var formdata = new FormData;
                        formdata.append("Name", $("#CCatname").val());
                        formdata.append("upload", image[0]);
                        $.ajax({
                            async: true,
                            type: "POST",
                            dataType: "JSON",
                            url: "/Categories/Create",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                if (result) {
                                    $.ajax({
                                        url: '/Categories/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_CategoryPartial').html(result);
                                            var close = document.getElementById('btnCreateColse');
                                            close.click();
                                        })
                                    });
                                } else {
                                    TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                                }
                            }
                        });
                    } else {
                        TestSweetAlert(Message);
                    }
                }
            });
        }
        return false;
    });

    $("#btnCategoryEdit").click(function () {
        if ($("#ECatname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else if ($("#ECatpicture").val() != "") {
            var fileInput = document.getElementById('ECatpicture');
            $.ajax({
                type: "Get",
                url: "/Categories/IsImageExist",
                data: { upload: fileInput.files[0].name },
                success: function (Message) {
                    if (Message == "") {
                        var image = $("#ECatpicture").get(0).files;
                        var formdata = new FormData;
                        formdata.append("Id", $("#hiddenId").val());
                        formdata.append("Name", $("#ECatname").val());
                        formdata.append("ImgUrl", $("#hiddenImgUrl").val()); 
                        formdata.append("upload", image[0]);
                        $.ajax({
                            async: true,
                            type: "POST",
                            dataType: "JSON",
                            url: "/Categories/Edit",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                debugger;
                                if (result) {
                                    $.ajax({
                                        url: '/Categories/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_CategoryPartial').html(result);
                                            var close = document.getElementById('btnEditColse');
                                            close.click();
                                        })
                                    });
                                } else {
                                    TestSweetAlert("حدث خطأما أثناء عملية التعديل تاكد من تعديل الحقول بالشكل الصحيح وحاول مرة أخرى");
                                }
                            }
                        });
                    } else {
                        TestSweetAlert(Message);
                    }
                }
            });
        } else {
            var formdata = new FormData;
            formdata.append("Id", $("#hiddenId").val());
            formdata.append("Name", $("#ECatname").val());
            formdata.append("ImgUrl", $("#hiddenImgUrl").val());
            $.ajax({
                async: true,
                type: "POST",
                dataType: "JSON",
                url: "/Categories/Edit",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result) {
                        $.ajax({
                            url: '/Categories/Refreash',
                            contentType: 'application/html; charset=utf-8',
                            type: 'GET',
                            dataType: 'html',
                            success: (function (result) {
                                $('#_CategoryPartial').html(result);
                                var close = document.getElementById('btnEditColse');
                                close.click();
                            })
                        });
                    } else {
                        TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                    }
                }
            });

        }
        return false;
    });

    $("#btnCategoryDelete").click(function () {
        var CategoryId = $("#CategoryId").val();
        $.ajax({
            type: "Post",
            url: "/Categories/DeleteConfirmed",
            data: { id: CategoryId },
            success: function (message) {
                debugger;
                if (message == "") {
                    $("#Modal-categoryDelete").modal('hide');
                    $("#CategoryId").val(null);
                    $.ajax({
                        url: '/Categories/Refreash',
                        contentType: 'application/html; charset=utf-8',
                        type: 'GET',
                        dataType: 'html',
                        success: (function (result) {
                            $('#_CategoryPartial').html(result);
                        })
                    })
                } else if (message == "haveItem") {
                    swal({
                        // title: "Are you sure?",
                        text: "هناك عدد من العناصر مندرجة تحت هذا الصنف بحدفك لهذا الصنف سيتم حدف جميع العناصر المندرجة له",
                        className: 'swal-IW',
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((result) => {
                        if (result == true) {
                            $("#Modal-categoryDelete").modal('hide');
                            $("#CategoryId").val(null);
                            $.ajax({
                                type: 'GET',
                                url: '/Categories/DeleteCategoryandItems',
                                data: { id: CategoryId },
                                contentType: 'application/html; charset=utf-8',
                                dataType: 'html',
                                success: (function (result) {
                                    $.ajax({
                                        url: '/Categories/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_CategoryPartial').html(result);
                                        })
                                    })
                                })
                            })
                        } else {
                            $("#Modal-categoryDelete").modal('hide');
                            $("#CategoryId").val(null);
                        }
                    });
                }
            },
        });
        return false;
    });
});

//#endregion Restaurant-Dashboard

//#region Item-Dashboard

// Edit Action

var EditItemConfirm = function (_id) {
    $("#itemId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Items/GetItem",
        data: { id: _id },
        success: function (item) {
            $("#Modal-itemEdit").modal('show');
            $("#EIname").val(item.Name)
            $("#EIprice").val(item.Price)
            $("#EItimeOfDone").val(item.TimeOfDone)
            $("#EIcategory").val(item.CategoryId)
            $("#EIrestaurant").val(item.RestaurantId)
            document.getElementById('EIimgUrl').src = "/Uploads/Items/" + item.ImgUrl;
            $("#hiddenId").val(_id)
            $("#hiddenImgUrl").val(item.ImgUrl)
        }
    });
};

// Delete Action

var DeleteItemConfirm = function (_id) {
    $("#itemId").val(_id)
    $.ajax({
        type: "Post",
        url: "/Items/GetItem",
        data: { id: _id },
        success: function (item) {
            $("#Modal-itemDelete").modal('show');
            $("#DIname").val(item.Name)
            $("#DIprice").val(item.Price)
            $("#DItimeOfDone").val(item.TimeOfDone)
            $("#DIcategory").val(item.Category)
            $("#DIrestaurant").val(item.Restaurant)
            document.getElementById('DIimgUrl').src = "/Uploads/Items/" + item.ImgUrl;
        }
    });
};


$(document).ready(function () {

    $("#btnItemCreate").click(function () {

        if ($("#CIname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else if ($("#CIprice").val() == "") {
            TestSweetAlert("قم بأدخال السعر");
        } else if ($("#CItimeOfDone").val() == "") {
            TestSweetAlert("قم بأدخال وقت التحظير");
        } else if ($("#CIpicture").val() == "") {
            TestSweetAlert("قم بأضافة صورة للعنصر");
        } else {
            var fileInput = document.getElementById('CIpicture');
            $.ajax({
                type: "Get",
                url: "/Items/IsImageExist",
                data: { upload: fileInput.files[0].name },
                success: function (Message) {
                    if (Message == "") {
                        var image = $("#CIpicture").get(0).files;
                        var formdata = new FormData;
                        formdata.append("Name", $("#CIname").val());
                        formdata.append("Price", $("#CIprice").val());
                        formdata.append("TimeOfDone", $("#CItimeOfDone").val());
                        formdata.append("CategoryId", $("#CIcategory").val());
                        formdata.append("RestaurantId", $("#CIrestaurant").val());
                        formdata.append("upload", image[0]);
                        $.ajax({
                            async: true,
                            type: "POST",
                            dataType: "JSON",
                            url: "/Items/Create",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                if (result) {
                                    $.ajax({
                                        url: '/Items/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_ItemParial').html(result);
                                            var close = document.getElementById('btnCreateColse');
                                            close.click();
                                        })
                                    });
                                } else {
                                    TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                                }
                            }
                        });
                    } else {
                        TestSweetAlert(Message);
                    }
                }
            });
        }
        return false;
    });

    $("#btnItemEdit").click(function () {

        if ($("#EIname").val() == "") {
            TestSweetAlert("قم بأدخال الأسم");
        } else if ($("#EIprice").val() == "") {
            TestSweetAlert("قم بأدخال السعر");
        } else if ($("#EItimeOfDone").val() == "") {
            TestSweetAlert("قم بأدخال وقت التحظير");
        } else if ($("#EIpicture").val() != "") {
            var fileInput = document.getElementById('EIpicture');
            $.ajax({
                type: "Get",
                url: "/Items/IsImageExist",
                data: { upload: fileInput.files[0].name },
                success: function (Message) {
                    if (Message == "") {
                        var image = $("#EIpicture").get(0).files;
                        var formdata = new FormData;
                        formdata.append("Id", $("#hiddenId").val());
                        formdata.append("Name", $("#EIname").val());
                        formdata.append("Price", $("#EIprice").val());
                        formdata.append("TimeOfDone", $("#EItimeOfDone").val());
                        formdata.append("ImgUrl", $("#hiddenImgUrl").val());
                        formdata.append("CategoryId", $("#EIcategory").val());
                        formdata.append("RestaurantId", $("#EIrestaurant").val());
                        formdata.append("upload", image[0]);
                        $.ajax({
                            async: true,
                            type: "POST",
                            dataType: "JSON",
                            url: "/Items/Edit",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                if (result) {
                                    $.ajax({
                                        url: '/Items/Refreash',
                                        contentType: 'application/html; charset=utf-8',
                                        type: 'GET',
                                        dataType: 'html',
                                        success: (function (result) {
                                            $('#_ItemParial').html(result);
                                            var close = document.getElementById('btnEditColse');
                                            close.click();
                                        })
                                    });
                                } else {
                                    TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                                }
                            }
                        });
                    } else {
                        TestSweetAlert(Message);
                    }
                }
            });
        } else {
            var formdata = new FormData;
            formdata.append("Id", $("#hiddenId").val());
            formdata.append("Name", $("#EIname").val());
            formdata.append("Price", $("#EIprice").val());
            formdata.append("TimeOfDone", $("#EItimeOfDone").val());
            formdata.append("ImgUrl", $("#hiddenImgUrl").val());
            formdata.append("CategoryId", $("#EIcategory").val());
            formdata.append("RestaurantId", $("#EIrestaurant").val());
            $.ajax({
                async: true,
                type: "POST",
                dataType: "JSON",
                url: "/Items/Edit",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result) {
                        $.ajax({
                            url: '/Items/Refreash',
                            contentType: 'application/html; charset=utf-8',
                            type: 'GET',
                            dataType: 'html',
                            success: (function (result) {
                                $('#_ItemParial').html(result);
                                var close = document.getElementById('btnEditColse');
                                close.click();
                            })
                        });
                    } else {
                        TestSweetAlert("حدث خطأما أثناء عملية الأضافة تاكد من أدخال الحقول بالشكل الصحيح وحاول مرة أخرى");
                    }
                }
            });

        }
        return false;
    });
  
    $("#btnItemDelete").click(function () {
        var itemId = $("#itemId").val();
        $.ajax({
            type: "Post",
            url: "/Items/DeleteConfirmed",
            data: { id: itemId },
            success: function (result) {
                if (result) {
                    $("#Modal-itemDelete").modal('hide');
                    $("#itemId").val(null);
                    $.ajax({
                        url: '/Items/Refreash',
                        contentType: 'application/html; charset=utf-8',
                        type: 'GET',
                        dataType: 'html',
                        success: (function (result) {
                            $('#_ItemParial').html(result);
                        })
                    })
                } else {
                    TestSweetAlert("حذث خطا ما أثناء عملية الحدف ");
                }
            }
        });
    })
});


//#endregion Item-Dashboard

//#region login and register window

const wrapper = document.querySelector(".wrapper ");
const loginLinke = document.querySelector(".login-like");
const registerLinke = document.querySelector(".register-like");
const ptnpopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLinke.addEventListener('click', () => {
    wrapper.classList.add('active');
});
loginLinke.addEventListener('click', () => {
    wrapper.classList.remove('active');
});
ptnpopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

//#endregion login and register window

//#region GetRestaurants
var GetRestaurants = function (event) {
    $.ajax({
        type: "Post",
        url: "/Home/GetRegionRestaurants",
        success: function (result) {
            if (result) {
                window.location.href = "/Home/GetRegionRestaurants"
            }
            //else {
            //    swal({
            //        // title: "Are you sure?",
            //        text: "سيتم عرض كل المطاعم لأنه لم يتم تحديد المنطقة أدا كنت ترغب بعرض جميع المطاعم  أدغط على موافق",
            //        className: 'swal-IW',
            //        icon: "warning",
            //        buttons: true,
            //        dangerMode: true,
            //    }).then((result) => {
            //        if (result == true) {
            //            $.ajax({
            //                type: 'GET',
            //                url: '/Home/GetAllRestaurants',
            //                success: function (result) {
            //                    window.location.href = "/Home/GetRestaurants"
            //                }
            //            })
            //        }
            //    })
            //}

        }
    });
};

//#endregion GetRestaurants

//#region GetrestaurantCategories 

var _resturantId = $("#restaurantId").val();

var getItems = function (_id) {
    $.ajax({
        type: "Get",
        url: "/Home/GetCategoryItems",
        data: { categoryId: _id, restaurantId: _resturantId },
        success: function (items) {
            $('#_SelectedCategoryItems').html(items);
            return false;
        }
    });
};

var getallItems = function () {
    $.ajax({
        type: "Get",
        url: "/Home/GetAllRestaurantItems",
        data: { restaurantId: _resturantId },
        success: function (items) {
            $('#_SelectedCategoryItems').html(items);
            return false;
        }
    });
};

//#endregion GetrestaurantCategories
