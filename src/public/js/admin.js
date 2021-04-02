var loadFile = function(event) {
    var output = $("#image-preview");
    if ($('#image-clinic').val()) {
        output.removeClass('d-none');
        output.addClass('d-block');
        output.attr('src', URL.createObjectURL(event.target.files[0]));
    }
};

function loadImageUserSetting() {
    var output = $("#img-user-setting");
    if ($('#update-avatar').val()) {
        output.attr('src', URL.createObjectURL(event.target.files[0]));
    }
}

function createNewPost(markdown, converter) {
    $('#createNewPost').on('click', function(event) {
        let formData = new FormData($('form#formCreateNewPost')[0]);
        let contentMarkdown = markdown.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        formData.append('contentMarkdown', contentMarkdown);
        formData.append('contentHTML', contentHTML);
        formData.append('title', $('#title-post').val());

        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/supporter/manage/post/create`,
            data: data,
            success: function(data) {
                alert('A new post is created successfully!');
                window.location.href = `${window.location.origin}/supporter/manage/posts`;
            },
            error: function(error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error)
            }
        });

    });
}

function deleteClinicById() {
    $('.delete-specific-clinic').bind('click', function(e) {
        e.preventDefault();
        if (!confirm('Delete this clinic?')) {
            return
        }

        let id = $(this).data('clinic-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/clinic`,
            data: { id: id },
            success: function(data) {
                node.closest("tr").remove();
                alertify.success('Delete succeed!');
            },
            error: function(err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function createNewClinic(markdownIntroClinic, converter) {
    $("#createNewClinic").on('click', function(e) {
        let formData = new FormData($('form#formCreateNewClinic')[0]);
        let contentMarkdown = markdownIntroClinic.value();
        let contentHTML = converter.makeHtml(contentMarkdown);

        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('introductionMarkdown', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            handleCreateClinicNormal(formData);
        } else {
            // create without file upload
            let data = {
                introductionMarkdown: contentMarkdown,
                introductionHTML: contentHTML
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleCreateClinicWithoutFile(data);
        }
    });
}

function handleCreateClinicWithoutFile(data) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/clinic/create-without-file`,
        data: data,
        success: function(data) {
            alert('A new clinic is created successfully');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error)
        }
    });
}

function handleCreateClinicNormal(formData) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/clinic/create`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            alert('A new clinic is created successfully');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}


function handleUpdateClinicNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/clinic/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateClinicWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/clinic/update-without-file`,
        data: data,
        success: function(data) {
            alert('Update succeed');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}



function showModalSettingUser() {
    $('.user-setting').on('click', function(e) {
        e.preventDefault();
        $('#modalSettingUser').modal('show');

    });
}

function createNewMerchant() {
    $('#createNewMerchant').on('click', function(e) {
        e.preventDefault();
        let formData = new FormData($('form#formCreateNewMerchant')[0]);
        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/admin/merchant/create`,
            data: data,
            success: function(data) {
                alert('Create a new merchant succeeds');
                window.location.href = `${window.location.origin}/users/manage/merchant`;
            },
            error: function(error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });
}

function deleteMerchantById() {
    $('.delete-merchant-info').on('click', function(e) {
        if (!confirm('Delete this merchant?')) {
            return
        }

        let id = $(this).data('merchant-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/merchant`,
            data: { id: id },
            success: function(data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function(err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function showModalInfoMerchant() {
    $('.show-merchant-info').on('click', function(e) {
        e.preventDefault();
        let id = $(this).data('merchant-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-merchant-by-id`,
            data: { id: id },
            success: function(data) {
                $('#imageMerchant').empty();

                $('#nameMerchant').val(data.merchant.name);
                if (data.merchant.phone) {
                    $('#phoneMerchant').val(data.merchant.phone);
                } else {
                    $('#phoneMerchant').val('Has not been updated');
                }
                if (data.merchant.address) {
                    $('#addressMerchant').val(data.merchant.address);
                } else {
                    $('#addressMerchant').val('Has not been updated');
                }
                $('#specializationMerchant').val(data.merchant.specializationName);
                $('#clinicMerchant').val(data.merchant.clinicName);
                if (data.merchant.avatar) {
                    $('#imageMerchant').prepend(`<img class="img-info-clinic" src="/images/users/${data.merchant.avatar}" />`)
                } else {
                    $('#imageMerchant').text('Has not been updated')
                }

                $('#modalInfoMerchant').modal('show');
            },
            error: function(error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });

}

function updateMerchant() {
    $('#btnUpdateMerchant').on('click', function(e) {
        let merchantId = $('#btnUpdateMerchant').data('merchant-id');

        let formData = new FormData($('form#formUpdateMerchant')[0]);
        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('avatar', document.getElementById('image-clinic').files[0]);
            formData.append('id', merchantId);
            handleUpdateMerchantNormal(formData);
        } else {
            // create without file upload
            let data = {
                id: merchantId,
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleUpdateMerchantWithoutFile(data);
        }
    });
}

function handleUpdateMerchantNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/merchant/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/merchant`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateMerchantWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/merchant/update-without-file`,
        data: data,
        success: function(data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/merchant`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function deleteSpecializationById() {
    $('.delete-specialization').on('click', function(e) {
        if (!confirm('Delete this specialist?')) {
            return
        }
        let id = $(this).data('specialization-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/specialization`,
            data: { id: id },
            success: function(data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function(err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function showPostsForSupporter() {
    let currentPage = 1;
    let total = $('#paginationForPost').data('total');
    if (total === 1) {
        $(' .li-next').addClass('disabled');
    }
    $('.page-post-next').on('click', function(e) {
        e.preventDefault();
        currentPage++;
        $(' .li-pre').removeClass('disabled');

        if (currentPage === total) {
            $(' .li-next').addClass('disabled');
        }
        if (currentPage > total) return;
        generateTablePostPagination(currentPage);
    });

    $('.page-post-pre').on('click', function(e) {
        e.preventDefault();
        currentPage--;
        $(' .li-next').removeClass('disabled');
        if (currentPage === 1) {
            $(' .li-pre').addClass('disabled');
        }
        if (currentPage === 0) return;
        generateTablePostPagination(currentPage);
    });
}

function generateTablePostPagination(page) {
    $.ajax({
        url: `${window.location.origin}/supporter/pagination/posts?page=${page}`,
        method: 'GET',
        success: function(data) {
            $("#listPostsTable tbody").empty();
            let html = '';
            data.posts.rows.forEach((post) => {
                html += `
                 <tr>
                        <td> ${post.id}</td>
                        <td>${post.title}</td>
                        <td>${post.writerName}</td>
                        <td>${post.dateClient}</td>
                        <td class="">
                            <a class=" " href="/supporter/post/edit/${post.id}" title="Edit info"><i class="fas fa-pen-square mx-3"></i></a>
                            <a class="delete-post" href="#" data-post-id="${post.id}" title="Delete"><i class="fas fa-trash"></i></a>
                        </td>
                   </tr>
                `;
            });
            $("#listPostsTable tbody").append(html);
        },
        error: function(err) {
            alertify.error('An error occurs, please try again later!');
            console.log(err)
        }
    });
}

function deletePostById() {
    $('.delete-post').on('click', function(e) {
        if (!confirm('Delete this post?')) {
            return
        }
        let id = $(this).data('post-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/post`,
            data: { id: id },
            success: function(data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function(err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function updatePost(markdown, converter) {
    $('#btnUpdatePost').on('click', function(e) {
        let postId = $('#btnUpdatePost').data('post-id');
        let formData = new FormData($('form#formUpdatePost')[0]);
        let contentMarkdown = markdown.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        formData.append('contentMarkdown', contentMarkdown);
        formData.append('contentHTML', contentHTML);
        formData.append('title', $('#titlePost').val());

        let data = {
            id: postId
        };
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "PUT",
            url: `${window.location.origin}/supporter/post/update`,
            data: data,
            success: function(data) {
                alert('Update succeeds');
                window.location.href = `${window.location.origin}/supporter/manage/posts`;
            },
            error: function(error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error)
            }
        });

    });
}

function createScheduleByMerchant(scheduleArr) {
    $("#createNewScheduleMerchant").on("click", function() {
        if (scheduleArr.length === 0) {
            alertify.error('Have not selected a plan to save');
            return
        }

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/merchant/manage/schedule/create`,
            data: { 'schedule_arr': scheduleArr },
            success: function(data) {
                if (data.status === 1) {
                    alertify.success('Add a successful appointment');
                }
            },
            error: function(error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error)
            }

        });
    });
}

function handleBtnSchedule() {
    let scheduleArr = [];
    $('.btn-schedule').unbind('click').bind('click', function(e) {
        let idBtn = $(this).attr('id');
        $(`#${idBtn}`).toggleClass('btn btn-css');

        let time = $(`#${idBtn}`).attr("value");
        let date = $("#datepicker").val();

        //check có class thì add new row, else try to remove
        if ($(`#${idBtn}`).hasClass("btn-css")) {

            let item = {
                'date': date,
                'time': time,
                'id': `${idBtn}-${date}`
            };
            scheduleArr.push(item);
            $('#tableCreateSchedule tbody').append(
                ` <tr id="row-${idBtn}">
                         <td>${time}</td>
                         <td>${date}</td>
                  </tr>`);
        } else {
            let count = -1;
            let timeCheck = $(`#${idBtn}`).attr("value");
            let dateCheck = $("#datepicker").val();
            scheduleArr.forEach((x, index) => {
                if (x.time === timeCheck && x.date === dateCheck) {
                    count = index;
                }
            });
            if (count > -1) scheduleArr.splice(count, 1);

            $(`table#tableCreateSchedule tr#row-${idBtn}`).remove();
        }

        scheduleArr.sort(function(a, b) {
            return a.time.localeCompare(b.time)
        });
    });

    return scheduleArr;
}

function handleChangeDatePicker(currentDate) {
    $('#datepicker').datepicker().on('changeDate', function(event) {
        let date = $("#datepicker").val();
        let dateConvert = stringToDate(date, "dd/MM/yyyy", "/");
        let currentDateConvert = stringToDate(currentDate, "dd/MM/yyyy", "/");
        if (dateConvert >= currentDateConvert) {
            //continue, refresh button
            $('.btn-schedule').removeClass('btn-css').addClass('btn');
        } else {
            $('#datepicker').datepicker("setDate", new Date());
            alertify.error('Cant create a plan for the past');
        }
    });
}

function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);

}

function loadNewCustomersForSupporter() {
    $.ajax({
        url: `${window.location.origin}/supporter/get-customers-for-tabs`,
        method: 'POST',
        success: function(data) {
            let countNew = data.object.newCustomers.length;
            let countPending = data.object.pendingCustomers.length;
            let countConfirmed = data.object.confirmedCustomers.length;
            let countCanceled = data.object.canceledCustomers.length;

            $('#count-new').text(`${countNew}`);
            $('#count-need').text(`${countPending}`);
            $('#count-confirmed').text(`${countConfirmed}`);
            $('#count-canceled').text(`${countCanceled}`);

            let htmlNew, htmlPending, htmlConfirmed, htmlCanceled = '';
            data.object.newCustomers.forEach((customer) => {
                htmlNew += `
                <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td>${convertStringToDateClient(customer.updatedAt)}      </td>
                    <td> 
                    <button type="button"  data-customer-id="${customer.id}" class="ml-3 btn btn-primary btn-new-customer-ok"> Receive</button>
                    <button  type="button" data-customer-id="${customer.id}" class="ml-3 btn btn-danger btn-new-customer-cancel"> Cancel </button>
                    </td>
                </tr>
                `;
            });

            data.object.pendingCustomers.forEach((customer) => {
                htmlPending += `
                <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td> ${convertStringToDateClient(customer.updatedAt)}      </td>
                    <td> 
                    <button  data-customer-id="${customer.id}"  class="ml-3 btn btn-warning btn-pending-customer">Confirm</button>
                    <button  type="button" data-customer-id="${customer.id}" class="ml-3 btn btn-danger btn-pending-customer-cancel"> Cancel </button>
                    </td>
                </tr>
                `;
            });

            data.object.confirmedCustomers.forEach((customer) => {
                htmlConfirmed += `
                <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td> ${convertStringToDateClient(customer.updatedAt)}     </td>
                    <td> 
                    <button  type="button" data-customer-id="${customer.id}"  class="ml-3 btn btn-info btn-confirmed-customer"> Information</button>
                    </td>
                </tr>
                `;
            });

            data.object.canceledCustomers.forEach((customer) => {
                htmlCanceled += `
                <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td> ${convertStringToDateClient(customer.updatedAt)} </td>
                    <td> 
                    <button   data-customer-id="${customer.id}"  class="ml-3 btn btn-primary btn-history-cancel-customer">History</button>
                    </td>
                </tr>
                `;
            });

            $('#tableNewCustomers tbody').append(htmlNew);
            $('#tableNeedConfirmCustomers tbody').append(htmlPending);
            $('#tableConfirmedCustomers tbody').append(htmlConfirmed);
            $('#tableCancelCustomers tbody').append(htmlCanceled);
        },
        error: function(error) {
            console.log(error);
            alertify.error('An error occurs, please try again later!');
        }
    })
}

function handleBtnNewCustomerOk() {
    $("#tableNewCustomers").on("click", ".btn-new-customer-ok", function(e) {
        if (!confirm('Do you want to confirm admission of this customer?')) {
            return
        }
        let countNew = +$('#count-new').text();
        let countPending = +$('#count-need').text();
        let customerId = $(this).data('customer-id');
        this.closest("tr").remove();
        countNew--;
        countPending++;
        $('#count-new').text(countNew);
        $('#count-need').text(countPending);

        $.ajax({
            url: `${window.location.origin}/supporter/change-status-customer`,
            method: 'POST',
            data: { customerId: customerId, status: 'pending' },
            success: function(data) {
                let customer = data.customer;
                addNewRowTablePending(customer);
            },
            error: function(error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

function handleBtnNewCustomerCancel() {
    $("#tableNewCustomers").on("click", ".btn-new-customer-cancel", function(e) {
        $('#btnCancelBookingCustomer').attr('data-customer-id', $(this).data('customer-id'));
        $('#btnCancelBookingCustomer').attr('data-type', 'new-customer-cancel');
        $('#modalCancelBooking').modal('show');
    });
}

function callAjaxRenderModalInfo(customerId, option) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/get-detail-customer-by-id`,
        data: { customerId: customerId },
        success: function(data) {
            $('#customerName').val(data.name);
            $('#btn-confirm-customer-done').attr('data-customer-id', data.id);
            $('#customerPhone').val(data.phone);
            $('#customerEmail').val(data.email);
            $('#customerDate').val(data.dateBooking);
            $('#customerTime').val(data.timeBooking);
            $('#customerReason').text(data.description);
            $('#customerAddress').text(data.address);
            if (data.ExtraInfo) {
                $('#customerHistoryBreath').text(data.ExtraInfo.historyBreath);
                $('#customerMoreInfo').text(data.ExtraInfo.moreInfo);
            }
            if (option) {
                $('#btn-confirm-customer-done').css('display', 'none');
                $('#btn-cancel-customer').text("OK");
            }
            $('#modalDetailCustomer').modal('show');
        },
        error: function(err) {
            console.log(error);
            alertify.error('An error occurs, please try again later!');
        }
    });
}

function handleBtnPendingCustomer() {
    $("#tableNeedConfirmCustomers").on("click", ".btn-pending-customer", function(e) {
        let customerId = $(this).data('customer-id');
        let option = false;
        callAjaxRenderModalInfo(customerId, option);
    });
}

function handleBtnPendingCancel() {
    $("#tableNeedConfirmCustomers").on("click", ".btn-pending-customer-cancel", function(e) {
        $('#btnCancelBookingCustomer').attr('data-customer-id', $(this).data('customer-id'));
        $('#btnCancelBookingCustomer').attr('data-type', 'pending-customer-cancel');
        $('#modalCancelBooking').modal('show');
    });
}

function addNewRowTablePending(customer) {
    let htmlPending = `
                 <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td> ${convertStringToDateClient(customer.updatedAt)}     </td>
                    <td> 
                    <button  data-customer-id="${customer.id}"  class="ml-3 btn btn-warning btn-pending-customer">Confirm</button>
                    <button  type="button" data-customer-id="${customer.id}" class="ml-3 btn btn-danger btn-pending-customer-cancel"> Cancel </button>
                    </td>
                </tr>
               
                `;
    $('#tableNeedConfirmCustomers tbody').prepend(htmlPending);
}

function addNewRowTableConfirmed(customer) {
    let htmlConfirmed = `
                <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td> ${convertStringToDateClient(customer.updatedAt)}     </td>
                    <td> 
                    <button  type="button" data-customer-id="${customer.id}"  class="ml-3 btn btn-info btn-confirmed-customer"> Information</button>
                    </td>
                </tr>
                `;
    $('#tableConfirmedCustomers tbody').prepend(htmlConfirmed);

}

function addNewRowTableCanceled(customer) {
    let htmlPending = `
                  <tr>
                    <td> ${customer.id} - ${customer.name}   </td>
                    <td> ${customer.phone}     </td>
                    <td> ${customer.email}     </td>
                    <td> ${convertStringToDateClient(customer.updatedAt)} </td>
                    <td> 
                    <button   data-customer-id="${customer.id}"  class="ml-3 btn btn-primary btn-history-cancel-customer">History</button>
                    </td>
                </tr>
               
                `;
    $('#tableCancelCustomers tbody').prepend(htmlPending);
}

function convertStringToDateClient(string) {
    return moment(Date.parse(string)).format("DD/MM/YYYY, HH:mm A");
}

function handleAfterCallingCustomer() {
    $('#btn-confirm-customer-done').on('click', function(e) {
        if (!confirm('Have you phoned to confirm whether the customer has an appointment?')) {
            return;
        }
        let countPending = +$('#count-need').text();
        let countConfirmed = +$('#count-confirmed').text();
        countPending--;
        countConfirmed++;
        $('#modalDetailCustomer').modal('hide');
        let customerId = $('#btn-confirm-customer-done').attr('data-customer-id');
        $('#tableNeedConfirmCustomers tbody').find(`.btn-pending-customer[data-customer-id=${customerId}]`).closest("tr").remove();
        $('#count-need').text(countPending);
        $('#count-confirmed').text(countConfirmed);

        $.ajax({
            url: `${window.location.origin}/supporter/change-status-customer`,
            method: 'POST',
            data: { customerId: customerId, status: 'confirmed' },
            success: function(data) {
                console.log(data)
                let customer = data.customer;
                addNewRowTableConfirmed(customer);
            },
            error: function(error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

function handleViewInfoCustomerBooked() {
    $("#tableConfirmedCustomers").on("click", ".btn-confirmed-customer", function(e) {
        let customerId = $(this).data('customer-id');
        let option = true;
        callAjaxRenderModalInfo(customerId, option);
    });
}

function handleCancelBtn() {
    $('#btnCancelBookingCustomer').on('click', function(e) {
        let formData = new FormData($('form#formCancelBooking')[0]);
        let data = {};
        let text = '';
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }

        if (data.reasonCancel === 'reason3') {
            if (!$('#otherReason').val()) {
                alert('Please fill in more information for another reason');
                return;
            }
            text = `Other reason: ${$('#otherReason').val()} `;
        } else if (data.reasonCancel === 'reason2') {
            text = 'The customer canceled the schedule';
        } else {
            text = 'Spam clinic appointment, not real'
        }

        let customerId = $('#btnCancelBookingCustomer').attr('data-customer-id');

        let type = $('#btnCancelBookingCustomer').attr('data-type');

        if (type === 'pending-customer-cancel') {
            let countPending = +$('#count-need').text();
            let countCancel = +$('#count-canceled').text();
            countPending--;
            countCancel++;
            $('#tableNeedConfirmCustomers tbody').find(`.btn-pending-customer-cancel[data-customer-id=${customerId}]`).closest("tr").remove();
            $('#count-need').text(countPending);
            $('#count-canceled').text(countCancel);
        } else {
            let countNew = +$('#count-new').text();
            let countCancel = +$('#count-canceled').text();
            countNew--;
            countCancel++;
            $('#tableNewCustomers tbody').find(`.btn-new-customer-cancel[data-customer-id=${customerId}]`).closest("tr").remove();
            $('#count-new').text(countNew);
            $('#count-canceled').text(countCancel);
        }

        $('#modalCancelBooking').modal('hide');

        $.ajax({
            url: `${window.location.origin}/supporter/change-status-customer`,
            method: 'POST',
            data: { customerId: customerId, status: 'failed', reason: text },
            success: function(data) {
                let customer = data.customer;
                addNewRowTableCanceled(customer);
            },
            error: function(error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });

    });
}

function handleBtnViewHistory() {
    $('#tableCancelCustomers').on('click', '.btn-history-cancel-customer', function() {
        let customerId = $(this).data('customer-id');
        $('#btn-view-history').attr('data-customer-id', customerId);
        $.ajax({
            url: `${window.location.origin}/supporter/get-logs-customer`,
            method: 'POST',
            data: { customerId: customerId },
            success: function(data) {
                $("#contentHistory").empty();

                let html = '';
                data.forEach((log) => {
                    html += `
                     <div class="form-row mb-3">
                            <div class="col-6">
                                <input type="text"  class="form-control" id="historyStatus" value="${log.content}">
                            </div>
                            <div class="col-3">
                                <input type="text"  class="form-control" id="personDone" value="${log.supporterName}">
                            </div>
                            <div class="col-3">
                                <input type="text"  class="form-control" id="timeDone" value="${convertStringToDateClient(log.createdAt)} ">
                            </div>
                        </div>
                    
                    `;
                });
                $('#contentHistory').append(html);
                $('#modalHistoryBooking').modal('show');
            },
            error: function(error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    })
}

function handleMerchantViewInfoCustomer() {
    $('.merchant-view-detail').on('click', function(e) {
        let customerId = $(this).attr('data-customer-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-detail-customer-by-id`,
            data: { customerId: customerId },
            success: function(data) {
                $('#imageOldForms').empty();
                $('#customerName').val(data.name);
                $('#customerPhone').val(data.phone);
                $('#customerEmail').val(data.email);
                $('#customerDate').val(data.dateBooking);
                $('#customerTime').val(data.timeBooking);
                $('#customerReason').text(data.description);
                $('#customerAddress').text(data.address);
                if (data.ExtraInfo) {
                    $('#customerHistoryBreath').text(data.ExtraInfo.historyBreath);
                    $('#customerMoreInfo').text(data.ExtraInfo.moreInfo);
                    if (data.ExtraInfo.oldForms) {
                        let images = JSON.parse(data.ExtraInfo.oldForms);
                        let html = '';
                        for (let [ key, value ] of Object.entries(images)) {
                            html += `
                              <a href="/images/customers/${value}" class="mr-3" target="_blank" title="Click to show the image">
                                <span>${value}</span>
                              </a>
                            `;
                        }

                        $('#imageOldForms').append(html)
                    } else {
                        $('#imageOldForms').append(`<span>No information</span>`)
                    }
                }

                $('#modalDetailCustomerForMerchant').modal('show');
            },
            error: function(err) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

function showModalSendForms() {
    $('.merchant-send-forms').on('click', function(e) {
        let customerId = $(this).attr('data-customer-id');
        let isSend = $(this).attr('data-is-send-forms');

        $.ajax({
            url: `${window.location.origin}/api/get-detail-customer-by-id`,
            method: "POST",
            data: { customerId: customerId },
            success: function(data) {
                let html = '';
                $('#divGenerateFilesSend').empty();
                $('#emailCustomer').val(data.email);
                $('#btnSendFilesForms').attr('data-customer-id', customerId);
                if (data.ExtraInfo) {
                    if (data.ExtraInfo.sendForms) {
                        let images = JSON.parse(data.ExtraInfo.sendForms);
                        for (let [ key, value ] of Object.entries(images)) {
                            html += `
                              <div class="form-row">
                                <div class="form-group col-9">
                                    <a type="text" class="form-control" id="nameFileSent" target="_blank" href="/images/customers/remedy/${value}" readonly="true" title="${value}" >
                               ${value}
                                </a>
                                </div>
                             </div>`;
                        }
                    } else {
                        html = `
                          <div class="form-row">
                            <div class="form-group col-9">
                                <label class="col-form-label text-label" for="nameFileSent"> File's name:</label>
                                <input type="text" class="form-control" id="nameFileSent" name="nameFileSent" disabled>
                            </div>
                         </div>`
                    }
                }
                $('#divGenerateFilesSend').append(html);
                $('#modalSendForms').modal('show');
            },
            error: function(error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

function handleSendFormsForCustomer() {
    $('#btnSendFilesForms').on("click", function(e) {
        if (!$('#filesSend').val()) {
            alert("Please select files before sending!");
            return;
        }
        $(this).prop('disabled', true);
        $('#processLoadingAdmin').removeClass('d-none');
        let formData = new FormData($('form#formSendFormsForCustomer')[0]);
        formData.append('customerId', $(this).attr('data-customer-id'));

        $.ajax({
            method: "POST",
            url: `${window.location.origin}/merchant/send-forms-to-customer`,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                $('#modalSendForms').modal('hide');
                $('#processLoadingAdmin').addClass('d-none');
                $('#btnSendFilesForms').prop('disabled', false);
                $(`.fa-exclamation-circle[data-customer-id=${data.customer.id}]`).css('color', '#36b9cc');
                $(`.fa-exclamation-circle[data-customer-id=${data.customer.id}]`).removeClass('fa-exclamation-circle').addClass('fa-check-circle')
                alertify.success('Sending remedies succeeds');
            },
            error: function(error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });
}

function resetModal() {
    $(`#modalDetailCustomer`).on('hidden.bs.modal', function(e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });

    $(`#modalHistoryBooking`).on('hidden.bs.modal', function(e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });

    $(`#modalDetailCustomerForMerchant`).on('hidden.bs.modal', function(e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });

    $(`#modalSendForms`).on('hidden.bs.modal', function(e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });
    $(`#modalCancelBooking`).on('hidden.bs.modal', function(e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
        $('#inputDefaultReason').prop('checked', true);
    });
}

function doneComment() {
    $(".done-comment").on('click', function(e) {
        if (confirm("Confirm save customer feedback?")) {
            let commentId = $(this).attr('data-comment-id');
            node = this;
            $.ajax({
                method: 'POST',
                url: `${window.location.origin}/supporter/done-comment`,
                data: { commentId: commentId },
                success: function(data) {
                    node.closest("tr").remove();
                    console.log(data);
                    alertify.success('Save customer feedback successfully');
                },
                error: function(error) {
                    alertify.error('An error occurs, please try again later!');
                    console.log(error);
                }
            })
        }

    })
}

function statisticalAdmin(month) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/statistical`,
        data: { month: month },
        success: function(data) {
            $('#sumCustomer').text(data.customers.count);
            $('#sumMerchant').text(data.merchants.count);
            $('#sumPost').text(data.posts.count);

            if (data.bestMerchant === '') {
                $('#bestMerchant').text(`No information`);
            } else {
                $('#bestMerchant').text(`${data.bestMerchant.name} (${data.bestMerchant.count})`);
            }
            if (data.bestSupporter === '') {
                $('#bestSupporter').text(`No information`);
            } else {
                $('#bestSupporter').text(`${data.bestSupporter.name} (${data.bestSupporter.count})`);
            }
        },
        error: function(error) {
            alertify.error('An error occurred while getting statistical information, please try again later');
            console.log(error);
        }
    })
}

function handleFindStatisticalAdmin(){
    $('#findStatisticalAdmin').on('click', function() {
        statisticalAdmin($('#monthAnalyse').val())
    })
}

$(document).ready(function(e) {
    // $('.modal').on('hidden.bs.modal', function(e) {
    //     $(this).removeData();
    // });

    let markdownIntroClinic = new SimpleMDE({
        element: document.getElementById("intro-clinic"),
        placeholder: 'Introductory content...',
        spellChecker: false
    });
    let markdownPost = new SimpleMDE({
        element: document.getElementById("contentMarkdown"),
        placeholder: 'Post content...',
        spellChecker: false
    });
    let converter = new showdown.Converter();
    //create datepicker, merchant create schedule
    $('#datepicker').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });
    $('#datepicker').datepicker("setDate", new Date());

    //create datepicker, merchant-appointment
    $('#dateMerchantAppointment').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });

    loadFile(e);
    loadImageUserSetting(e);
    deleteClinicById();
    showModalSettingUser();
    createNewMerchant();
    deleteMerchantById();
    showModalInfoMerchant();
    updateMerchant();
    deleteSpecializationById();
    showPostsForSupporter();
    deletePostById();
    createNewPost(markdownPost, converter);
    updatePost(markdownPost, converter);

    let arr = handleBtnSchedule();
    createScheduleByMerchant(arr);
    let currentDate = $("#datepicker").val();
    handleChangeDatePicker(currentDate);
    loadNewCustomersForSupporter();
    handleBtnNewCustomerOk();
    handleBtnNewCustomerCancel();
    handleBtnPendingCustomer();
    handleBtnPendingCancel();
    resetModal();
    handleAfterCallingCustomer();
    handleViewInfoCustomerBooked();
    handleCancelBtn();
    handleBtnViewHistory();

    handleMerchantViewInfoCustomer();
    showModalSendForms();
    handleSendFormsForCustomer();
    doneComment();

    let month = new Date().getMonth();
    statisticalAdmin(month+1);
    handleFindStatisticalAdmin();
});

