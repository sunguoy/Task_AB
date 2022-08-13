$(document).ready(function () {
    // show modal
    $('#task-modal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget) // Button that triggered the modal
        const taskID = button.data('source') // Extract info from data-* attributes
        const content = button.data('content') // Extract info from data-* attributes

        const modal = $(this)
        if (taskID === 'New Task') {
            modal.find('.modal-title').text(taskID)
            $('#task-form-display').removeAttr('taskID')
        } else {
            modal.find('.modal-title').text('Edit Task ' + taskID)
            $('#task-form-display').attr('taskID', taskID)
        }

        if (content) {
            modal.find('.form-control').val(content);
        } else {
            modal.find('.form-control').val('');
        }
    })


    $('#submit-task').click(function () {
        const description = $('#description').val();
        const email = $('#email').val();
        const priority = $('#priority').val();

        if(description== ''){
              alert('Please input description!');
              return false;
          }
          if(email!= ''){
              var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
              if(!reg.test(email)){
                alert("The format of Email is wrong, please check it!");
                return false;
              }
          }
          else{
              alert('Please input email!');
              return false;
          }
        if((priority != 'Low')&&(priority != 'Medium')&&(priority != 'High')){
              alert('Please select correct priority');
              return false;
          }
        console.log(description, email, priority);
        $.ajax({
            type: 'POST',
            url: '/submit',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({
                'description': description,
                'email': email,
                'priority': priority
            }),
            success: function (res) {
                console.log(res.response)
                location.reload();
            },
            error: function () {
                console.log('Error');
            }
        });
    });

    $('#clear').click(function () {
        $("#task_table tbody").empty();
        $.ajax({
            type: 'POST',
            url: '/clear',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({
            }),
            success: function (res) {
                console.log(res.response)
                location.reload();
            },
            error: function () {
                console.log('Error');
            }
        });
    });

});