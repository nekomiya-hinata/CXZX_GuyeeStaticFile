var FormFileUpload = function () {
    return {
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
                    endpoint: ctx + "/remoteupload/upload?dataid=" + $('#dataid').val(),
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
                    "url": ctx + "/remoteupload/list?dataid=" + $('#dataid').val(),
                    "type": "GET"
                },
                "fnDrawCallback": function () {
                    this.api().column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                },
                "columns": [
                    {"data": null, "title": "序号", "width": "30px", "className": "text-center dt-nowrap"},
                    {"data": "name", "title": "文件名", "className": " text-center dt-nowrap"},
                    {"data": "tag", "title": "标签", "className": " text-center dt-nowrap"},
                    {
                        "data": "size", "title": "文件大小", "width": "180px", "className": "text-center dt-nowrap",
                        render: function (data, type, row, meta) {
                        	if (data>1024*1024)
                        		return (data/1024*1024.0).toFixed(2)+'M'
                        	if (data>1024)
								return (data/1024.0).toFixed(2)+'K';
                        	else  return data;
                        }
                    },
                    {
                        "title": "操作",
                        "width": "180px",
                        "className": "text-center dt-nowrap",
                        "render": function (data, type, row, meta) {
                            return `
                                <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="FormFileUpload.view('${row.url}')">
                                  查看
                                </a>
                                <a href="javascript:void(0)" class="btn  btn-clean " title="删除" onclick="FormFileUpload.delRow('${row.id}')">
                                  删除
                                </a>
                               `;
                        }
                    }]
            });

            initUppy();

        },
        delRow: function (id) {
            blockUI($(window.document.body), '正在删除文件...');
            $.ajax({
                type: 'POST',
                url: ctx + "/remoteupload/remove",
                dataType: "json",
                data: {
                    'id': id
                },
                success: function (data) {
                    FormFileUpload.datatable.api().ajax.reload();
                    unblockUI($(window.document.body));
                    if (data.success) {
                        form_helpers.info(data.msg, '提示', 'success');

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
        view: function (url) {
            window.open(url);
        }

    };

}();

jQuery(document).ready(function () {
    FormFileUpload.initPage();
});