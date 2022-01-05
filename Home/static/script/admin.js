let dataList = [];
let listTask;
let listUser;
let listFile;
const FILEPATH = '/home/thomasvu/Documents/IOTWeb/upload/';
Array.prototype.forEach.call(
    document.querySelectorAll(".file-upload__button"),
    function (button) {
        const hiddenInput = button.parentElement.querySelector(
            ".file-upload__input"
        );
        const label = button.parentElement.querySelector(".file-upload__label");
        const defaultLabelText = "No file(s) selected";

        // Set default text for label
        label.textContent = defaultLabelText;
        label.title = defaultLabelText;

        button.addEventListener("click", function () {
            hiddenInput.click();
        });

        hiddenInput.addEventListener("change", function () {
            const filenameList = Array.prototype.map.call(hiddenInput.files, function (
                file
            ) {
                dataList.push(file);
                return file.name;
            });

            label.textContent = filenameList.join(", ") || defaultLabelText;
            label.title = label.textContent;
        });
    }
);


$('#add-task').on('click', function () {
    let formData = new FormData();
    let taskTitle = $('#task-title').val();
    let taskContent = $('#task-content').val();
    let deadline = moment($('#dt').val()).format('YYYY-MM-DD HH:MM:SS');
    formData.append('title', taskTitle);
    formData.append('content', taskContent);
    formData.append('deadline', deadline);
    for (data of dataList) {
        formData.append('file', data);
    }
    $.ajax({
        type: "POST",
        url: "http://" + window.location.host + "/test-upload/",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            dataList = [];
            $('#create-task').modal('hide');
            GetAllTaskList();
        }
    });
})

function RenderTask(username, title, deadline, taskID) {
    return `<tr class="data-row" id="${String(taskID) + Math.floor(Math.random()*(999-100+1)+100)}"> <th scope="row">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.jpg"
                            class="shadow-1-strong rounded-circle" alt="avatar 1"
                            style="width: 55px; height: auto;">
                        <span class="ms-2">${username}</span>
                    </th>
                    <td class="align-middle">
                        <span>${title}</span>
                    </td>
                    <td class="align-middle">
                        <span>${deadline} </span>
                    </td>
                    <td class="align-middle">
                        <a  data-mdb-toggle="tooltip" title="Done" class="btn-done"><i
                                class="fas fa-check text-success me-3"></i></a>
                        <a  data-mdb-toggle="tooltip" title="Remove" class="btn-remove"><i
                                class="fas fa-trash-alt text-danger btn-remove me-3"></i></a>
                        <a  data-mdb-toggle="tooltip" title="Edit" class="btn-edit"><i
                                class="fas fa-edit text-secondary btn-edit"></i></a>
                    </td>  </tr>`
}

function RenderAllTask() {
    $('.btn-task').removeClass('active');
    $('#all-task').addClass('active');
    let taskTable = '';
    for (let i = 0; i < listTask.length; i++) {
        let username = '';
        for (let userID = 0; userID < listUser.length; userID++) {
            if (listUser[userID].id == listTask[i].user_create) {
                username = listUser[userID].username;
            }
        }
        let task = listTask[i];
        let deadline = new Date(listTask[i].deadline);
        deadline = (listTask[i].deadline != null) ? deadline.toLocaleString() : 'Không có hạn';
        taskTable = taskTable + RenderTask(username, task.task_title, deadline, listTask[i].id)
    }
    $('#task-list').html('');
    $('#task-list').append(taskTable);
    AssignClickEvent();
    AssignEvent();
}

function GetAllTaskList() {
    $.ajax({
        type: 'GET',
        url: 'http://' + window.location.host + '/get-all-task/',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            listTask = response[0];
            listFile = response[1];
            listUser = response[2];
            RenderAllTask();
        }
    })
};

function AssignDownloadEvent() {
    $('.dw-btn').on('click', function () {
        let fileName = $(this).closest('.d-flex').contents().get(0).nodeValue.trim();;
        let filePath = FILEPATH + fileName;
        let fileType = $(this).next().text().replace(/\s/g, '');
        $.ajax({
            url: 'http://' + window.location.host + +'/get-file/',
            type: 'POST',
            data: {
                'path': filePath,
                'name': fileName.replace(' ', ''),
                'type': fileType
            },
            success: function (response) {
                if (response != 'false') {
                    var a = document.createElement("a");
                    a.href = "data:" + fileType + ";base64," + response;
                    console.log("data:" + fileType + "base64,")
                    a.download = fileName;
                    a.click();
                }
            }
        })
    })
}

function AssignClickEvent() {
    $('.data-row').on('click', function () {
        let idTask = this.id.slice(0, -3);
        let taskContent = '';
        let taskTitle = '';
        let userCreatedID = '';
        let userCreatedName = '';
        let listFileName = [];
        let downloadTag = '';
        let listFileType = []
        for (task of listTask) {
            if (task.id = idTask) {
                taskContent = task.task_content;
                taskTitle = task.task_title;
                userCreatedID = task.user_create;
                deadline = (task.deadline != null) ? (new Date(task.deadline)).toLocaleString() : 'Không có hạn';
            }
        }
        for (let user of listUser) {
            if (user.id = userCreatedID) {
                userCreatedName = user.nickname;
            }
        }
        for (let file of listFile) {
            if (idTask == file.task) {
                listFileName.push(file.file_path.replace(FILEPATH, ''));
                listFileType.push(file.file_type)
            }
        }
        for (let id = 0; id < listFileName.length; id++) {
            downloadTag = downloadTag + `<li class = "list-group-item d-flex justify-content-between align-items-center" >
                 ${listFileName[id]} <button class="btn btn-download badge bg-primary dw-btn"> <i class = "fas fa-download"> </i></button>
                 <p style ='display:none;' class='type'>${listFileType[id]}</p></li>
            `
        }
        $('#show-task-title').text(taskTitle);
        $('#show-task-content').text(taskContent);
        $('#dl').text('Đến hạn vào: ' + deadline);
        $("#list-file").html('');
        $("#list-file").append(downloadTag);
        $('#show-task').modal('show');
        AssignDownloadEvent();
    })
}

function AssignRemoveFile() {
    $('.btn-remove-file').on('click', function () {
        let fileID = $(this).next().text().replace(/\s/g, '');
        let fileTag = $(this).closest('.d-flex');
        $.ajax({
            type: 'POST',
            url: 'http://' + window.location.host + +'/remove-file/',
            data: {
                'id': fileID,
            },
            success: function (response) {
                if (response == 'check') {
                    console.log(fileTag);
                    fileTag.remove();
                }

            }
        })
    })
}

function AssignEvent() {
    $('.btn-remove').on('click', function (event) {
        event.stopPropagation();
        let taskID = $(this).closest('tr').attr('id').slice(0, -3);
        $.ajax({
            type: 'POST',
            url: 'http://' + window.location.host + +'/remove-task/',
            data: {
                'taskID': taskID
            },
            success: function (response) {
                GetAllTaskList();
            }
        })
    })
    $('.btn-done').on('click', function (event) {
        event.stopPropagation();
        let taskID = $(this).closest('tr').attr('id').slice(0, -3);
        $.ajax({
            type: 'POST',
            url: 'http://' + window.location.host + +'/finish-task/',
            data: {
                'taskID': taskID
            },
            success: function (response) {
                GetAllTaskList();
            }
        })
    })
    $('.btn-edit').on('click', function (event) {
        event.stopPropagation();
        let taskID = $(this).closest('tr').attr('id').slice(0, -3);
        let listFileName = [];
        let listTagFile = '';
        let listFileID = [];
        let taskTitle, taskContent, taskDeadline;
        for (let task of listTask) {
            if (taskID == task.id) {
                taskTitle = task.task_title;
                taskContent = task.task_content;
                taskDeadline = task.deadline;
            }
        }
        $('#edit-task-title').val(taskTitle);
        $('#edit-task-content').text(taskContent);
        $('#edit-dl').val(new Date(taskDeadline).toJSON().slice(0, 19));
        for (let file of listFile) {
            if (taskID == file.task) {
                listFileName.push(file.file_path.replace(FILEPATH, ''));
                listFileID.push(file.id);
            }
        }
        for (let id = 0; id < listFileName.length; id++) {
            listTagFile = listTagFile + `<li class = "list-group-item d-flex justify-content-between align-items-center" >
                 ${listFileName[id]} <button class="btn btn-remove-file badge bg-primary dw-btn"> <i class = "far fa-times-circle"> </i></button>
                 <p style ='display:none;' class='type'>${listFileID[id]}</p></li>
            `
        }
        $('#edit-file-list').html('');
        $('#edit-file-list').append(listTagFile);
        AssignRemoveFile();
        $('#edit-task').modal('show');
        $('#save-task').on('click', function () {
            let formData = new FormData();
            let taskTitle = $('#edit-task-title').val();
            let taskContent = $('#edit-task-content').val();
            let taskDeadline = moment($('#edit-dl').val()).format('YYYY-MM-DD HH:MM:SS');
            formData.append('id', taskID);
            formData.append('title', taskTitle);
            formData.append('content', taskContent);
            formData.append('deadline', taskDeadline);
            for (data of dataList) {
                formData.append('file', data);
            }
            $.ajax({
                type: 'POST',
                url: 'http://' + window.location.host + '/edit-task/',
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (response) {
                    if (response == 'done') {
                        $('#edit-task').modal('hide');
                        GetAllTaskList();
                    } else {
                        alert('Có lỗi xảy ra rồi!')
                    }
                }
            })
        })

    })
}

function RenderActiveTask() {
    $('.btn-task').removeClass('active');
    $('#ongoing-task').addClass('active');
    let taskTable = '';
    for (let i = 0; i < listTask.length; i++) {
        let taskDeadline = new Date(listTask[i].deadline);
        now = Date.now();
        if (taskDeadline >= now || listTask[i].deadline == null) {
            for (let userID = 0; userID < listUser.length; userID++) {
                if (listUser[userID].id == listTask[i].user_create) {
                    username = listUser[userID].username;
                }
            }
            deadline = (listTask[i].deadline != null) ? taskDeadline.toLocaleString() : 'Không có hạn';
            let task = listTask[i];
            taskTable = taskTable + RenderTask(username, task.task_title, deadline, listTask[i].id)
        }
        $('#task-list').html('');
        $('#task-list').append(taskTable);
        AssignClickEvent();
        AssignEvent();
    }
}

function RenderOnGoingTask() {
    $('.btn-task').removeClass('active');
    $('#ongoing-task').addClass('active');
    let taskTable = ''
    for (let i = 0; i < listTask.length; i++) {
        let taskDeadline = new Date(listTask[i].deadline);
        now = Date.now();
        if (listTask[i].taskstatus == 0) {
            console.log(listTask[i]);
            for (let userID = 0; userID < listUser.length; userID++) {
                if (listUser[userID].id == listTask[i].user_create) {
                    username = listUser[userID].username;
                }
            }
            deadline = (listTask[i].deadline != null) ? taskDeadline.toLocaleString() : 'Không có hạn';
            let task = listTask[i];
            taskTable = taskTable + RenderTask(username, task.task_title, deadline, listTask[i].id)
        }
        $('#task-list').html('');
        $('#task-list').append(taskTable);
    }
}

function RenderLateTask() {
    $('.btn-task').removeClass('active');
    $('#late-task').addClass('active');
    let taskTable = '';
    for (let i = 0; i < listTask.length; i++) {
        let taskDeadline = new Date(listTask[i].deadline);
        now = Date.now();
        if (taskDeadline < now && listTask[i].deadline != null) {
            for (let userID = 0; userID < listUser.length; userID++) {
                if (listUser[userID].id == listTask[i].user_create) {
                    username = listUser[userID].username;
                }
            }
            deadline = (listTask[i].deadline != null) ? taskDeadline.toLocaleString() : 'Không có hạn';
            let task = listTask[i];
            taskTable = taskTable + RenderTask(username, task.task_title, deadline, listTask[i].id)
        }
        $('#task-list').html('');
        $('#task-list').append(taskTable);
    }

}

function RenderFinishTask() {
    $('.btn-task').removeClass('active');
    $('#finish-task').addClass('active');
    let taskTable = '';
    for (let i = 0; i < listTask.length; i++) {
        if (listTask[i].taskstatus == 1) {
            for (let userID = 0; userID < listUser.length; userID++) {
                if (listUser[userID].id == listTask[i].user_create) {
                    username = listUser[userID].username;
                }
            }
            deadline = (listTask[i].deadline != null) ? taskDeadline.toLocaleString() : 'Không có hạn';
            let task = listTask[i];
            taskTable = taskTable + RenderTask(username, task.task_title, deadline, listTask[i].id)
        }
        $('#task-list').html('');
        $('#task-list').append(taskTable);
    }
}


$('#all-task').on('click', function () {
    RenderAllTask();
});
$('#ongoing-task').on('click', function () {
    RenderOnGoingTask();
})
$('#late-task').on('click', function () {
    RenderLateTask();
})
$('#finish-task').on('click', function () {
    RenderFinishTask();
})
$(document).ready(function () {
    GetAllTaskList();
});
function Userlogout() {
    $.ajax({
        type: "GET",
        url: "http://" + window.location.host + "/logout/",
        success: function (response) {
            if (response == "done") {
                window.location.href = "http://" + window.location.host;
            }
        }
    })
};

$('#logout').on('click', function () {
    Userlogout();
})