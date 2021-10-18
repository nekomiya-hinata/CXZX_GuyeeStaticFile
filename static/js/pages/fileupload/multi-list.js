var FormFileUpload = function () {
    return {
        //main function to initiate the module
        initPage: function () {
            $('#btn_refresh').on('click', function () {
                FormFileUpload.datatable.ajax.reload();
            })
            $('#btn_close').on('click', function () {
                window.close();
            })

            const Tus = Uppy.Tus;
            const xhr = Uppy.XHRUpload;
            const ProgressBar = Uppy.ProgressBar;
            const StatusBar = Uppy.StatusBar;
            const FileInput = Uppy.FileInput;
            const Informer = Uppy.Informer;

            // to get uppy companions working, please refer to the official documentation here: https://uppy.io/docs/companion/
            const Dashboard = Uppy.Dashboard;
            const Webcam = Uppy.Webcam;

            var initUppy = function () {

                var options = {
                    proudlyDisplayPoweredByUppy: false,
                    target: '#kt_uppy .kt-uppy__dashboard',
                    locale: Lang.uppy,
                    inline: false,
                    note: '请选择不超过10M的文件',
                    replaceTargetContent: true,
                    showProgressDetails: true,
                    height: 320,
                    browserBackButtonClose: true,
                    trigger: '#btn_upload'
                }

                var uppy = Uppy.Core({
                    autoProceed: true,
                    restrictions: {
                        maxFileSize: 10000000, // 10mb
                        maxNumberOfFiles: 5,
                        minNumberOfFiles: 1
                    }
                });

                uppy.use(Dashboard, options);
                uppy.use(xhr, {
                    endpoint: ctx + '/multiupload/upload?id=' + $('#id').val() + '&filepath=' + $('#filepath').val(),
                    formData: true,
                    fieldName: 'files'
                })

//                uppy.use(Tus, { endpoint: ctx + '/multiupload?id=' + $('#id').val() + '&filepath=' + $('#filepath').val() });
                uppy.use(Webcam, {target: Dashboard});

                uppy.on('complete', function (file) {
                    FormFileUpload.datatable.ajax.reload();
                });

            }

            $.extend($.fn.dataTable.defaults, {
                "info": false,
                "paging": false,
            });

            this.datatable = $('#table').DataTable({
                "language": Lang.datatable,
                "ajax": {
                    "url": ctx + "/multiupload/list?id=" + $('#id').val() + "&filepath=" + $('#filepath').val(),
                    "type": "GET",
                    "dataSrc": function (json) {
                        return json;
                    }
                },
                "fnDrawCallback": function () {
                    this.api().column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                },
                "columns": [
                    {"data": null, "title": "序号", "width": "30px", "className": "text-center dt-nowrap"},
                    {"data": "filename", "title": "文件名", "className": " text-center dt-nowrap"},
                    {
                        "data": "filesize", "title": "文件大小", "width": "180px", "className": "text-center dt-nowrap",
                        render: function (data, type, row, meta) {
                            if (data > 1024 * 1024)
                                return (data / 1024 * 1024.0).toFixed(2) + 'M'
                            if (data > 1024)
                                return (data / 1024.0).toFixed(2) + 'K';
                            else return data;
                        }
                    },
                    {
                        "title": "操作",
                        "width": "180px",
                        "className": "text-center dt-nowrap",
                        "mRender": function (data, type, row, meta) {
                            return `
                                <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="FormFileUpload.view('${row.filename}')">
                                  查看
                                </a>
                                <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="FormFileUpload.delRow('${row.filename}')">
                                  删除
                                </a>
                               `;
                        }
                    }]
            });

            initUppy();

        },
        delRow: function (filename) {

            blockUI($(window.document.body), '正在删除文件...');
            $.ajax({
                type: 'POST',
                url: ctx + "/multiupload/remove",
                dataType: "json",
                data: {
                    'id': $('#id').val(),
                    'filepath': $('#filepath').val(),
                    'filename': filename
                },
                success: function (data) {
                    FormFileUpload.datatable.ajax.reload();

                    unblockUI($(window.document.body));
                    if (data.success) {
                        form_helpers.success(data.msg, '提示');
                    } else {
                        form_helpers.error(data.msg);
                    }
                },
                error: function (req, status, ex) {
                    form_helpers.error("网络错误");
                },
                timeout: 60000
            });
        },
        view: function (filename) {
            window.open(ctx + "/multiupload/download?id=" + $('#id').val() + "&filepath=" + $('#filepath').val() + "&filename=" + filename);
        }

    };
}();

jQuery(document).ready(function () {
    FormFileUpload.initPage();
});