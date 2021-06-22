import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Form } from '@angular/forms';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { Menu } from '../../../webapi/model/models';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { Auth } from '../../../login/auth.service';
import { CommonUtils } from '../../../shared/common-utils/common-utils.service';
import * as _ from 'lodash';
import * as models from '../../../webapi/model/models';
import { MessagesApi } from '../../../webapi/api/api';
import { CommonModalComponent } from '../../../shared/commonauditlogmodel/index';
import { ConfirmationService } from 'primeng/primeng';
import { UserLogout } from '../../../webapi/model/models';
import { PropensityApi } from '../../../webapi/api/api';

@Component({
    moduleId: module.id,
    selector: 'crossselling-cmp',
    templateUrl: 'crossselling.component.html',
    providers: [CommonModalComponent, ConfirmationService],

    styles: [`
        .value-true {
            background-color: #1CA979 !important;
            color: #ffffff !important;
        }
        .value-false {
            background-color: #2CA8B1 !important;
            color: #ffffff !important;
        }
    `
    ]
})

export class CrosssellingComponent implements OnInit, OnDestroy {

    // cols: any[];

    // holds the modal form that is shown for create, edit and delete
    @ViewChild('lgModal') public lgModal: ModalDirective;
    @ViewChild('InfoModal') public InfoModal: ModalDirective;


    busy_ent: Subscription;
    busy_txn: Subscription;
    busy_read: Subscription;
    busy_login: Subscription;

    functionModel: models.FunctionId;
    function_id = '';
    function_desc = '';
    sub_menu = '';
    mapname = '';
    username = '';
    entitlements: models.Entitlements[];
    entitlement: models.Entitlement = new models.Entitlement();
    pushFieldValues: String[] = [];
    pushFieldDataValues: String[] = [];
    pushField: any;
    vone: SelectItem[];
    vtwo: SelectItem[];
    vthree: SelectItem[];
    vfour: SelectItem[];
    vfive: SelectItem[];
    vsix: SelectItem[];
    vseven: SelectItem[];
    veight: SelectItem[];
    vnine: SelectItem[];
    vten: SelectItem[];

    // Variables used for UI display
    cols: any[];
    selectedRows: models.PropensityData[];
    selectedRow: models.PropensityData;
    propensityData: models.PropensityData[];
    propensityMainData: models.PropensityData[];
    moduleViews: models.PropensityData[] = [];
    moduleView: models.PropensityData;

    PropensityFinalData: models.PropensityFinal[];
    propensityFinalMainData: models.PropensityFinal[];
    // Variables used for UI Drill display
    columns: any[];
    // form control variables
    crudMode: string = null;
    Authstatus: string = null;
    formError: boolean = false;
    // private variable to hold value of ColorPicker. This will be assiged to model colorcode 
    menuModel: Menu[] = [];
    userLogout: UserLogout;
    errorList: any[];
    messages: models.Messages;//UI message Model
    private color: string = '#f00';
    ctModal: any;
    totalRecord: number = 0;
    breadcrumb: MenuItem[];
    v1: any;
    v2: any;
    v3: any;
    v4: any;
    v5: any;
    v6: any;
    v7: any;
    v8: any;
    v9: any;
    v10: any;

    constructor
        (
            private route: ActivatedRoute,
            private router: Router,
            private auth: Auth,
            private PropensityApi: PropensityApi,
            private toastyService: ToastyService,
            private toastyConfig: ToastyConfig,
            private changeDetectorRef: ChangeDetectorRef,
            private _ngZone: NgZone,
            private messagesApi: MessagesApi,
            private commonUtils: CommonUtils
        ) {
        this.toastyConfig.theme = 'material';
        this.toastyConfig.position = 'top-center';
        this.toastyConfig.showClose = true;
        this.toastyConfig.timeout = 0;
        this.userLogout = { 'username': '' };
    }

    ngOnInit() {

        // Loading Messages JSON file from assets folder
        this.messagesApi.getMessagesData()
            .subscribe((data: any): void => {
                this.messages = data;
            });
        this.Authstatus = 'All';

        this.vone = [
            { label: ' -Choose- ', value: null },
            { label: 'Individual', value: '0' },
            { label: 'Corporate', value: '1' }
        ];

        this.vtwo = [
            { label: ' -Choose- ', value: null },
            { label: '<40', value: '0' },
            { label: '>40', value: '1' }];



        this.vthree = [
            { label: ' -Choose- ', value: null },
            { label: 'Male', value: '1' },
            { label: 'Female', value: '0' }
        ];


        this.vfour = [
            { label: ' -Choose- ', value: null },
            { label: 'Full time', value: '1' },
            { label: 'Part time', value: '0' }
        ];

        this.vfive = [
            { label: ' -Choose- ', value: null },
            { label: '< 1000000', value: '0' },
            { label: '> 1000000', value: '1' }

        ];
        this.vsix = [
            { label: ' -Choose- ', value: null },
            { label: '= 1', value: '0' },
            { label: '> 1', value: '1' }
        ];
        this.vseven = [
            { label: ' -Choose- ', value: null },
            { label: 'Yes', value: '0' },
            { label: 'No', value: '1' }
        ];
        this.veight = [
            { label: ' -Choose- ', value: null },
            { label: 'No', value: '0' },
            { label: 'Yes', value: '1' }
        ];
        this.vnine = [
            { label: ' -Choose- ', value: null },
            { label: 'No', value: '0' },
            { label: 'Yes', value: '1' }
        ];

        this.vten = [
            { label: ' -Choose- ', value: null },
            { label: 'No', value: '0' },
            { label: 'Yes', value: '1' }

        ];

        this.columns = [
            { field: 'O1', header: 'NO RISK PERCENTAGE', sortable: 'false' },
            { field: 'O10', header: 'RISK PERCENTAGE', sortable: 'false' },
            { field: 'RESULT', header: 'RESULT', sortable: 'false' }
        ];


        this.username = this.auth.getCurrUser();
        this.userLogout = { 'username': this.username };
        this.menuModel = this.auth.getMenu();

        this.route.queryParams
            .subscribe(
                queryparams => {
                    if (queryparams) {
                        this.function_id = queryparams['function_id'];
                        this.sub_menu = queryparams['sub_menu'];
                        // this.readPropensityFinal();
                        this.readPropensityData();
                    }
                },
                qryParamError => {
                    this.logError(qryParamError);
                },
                () => { });
    }

    logError(qryParamError: any): any {
        throw new Error('Method not implemented.');
    }

    ngOnDestroy() {

    }

    private onV1Change(event: any) {


        console.log('V1 :-' + JSON.stringify(this.moduleView.v1));

    }


    private onRowSelect(selectedRow: any) {
        this.selectedRow;
        console.log('TTTTT :' + JSON.stringify(this.selectedRow))
    }



    private closeModal() {
        this.lgModal.hide();
        this.selectedRow = null;
    }

    //readReconData
    private readPropensityFinal() {
        this.busy_read = this.PropensityApi.runPropensityFinal(
            this.username,
            this.function_id,

            'R')
            .subscribe(
                results => {
                    // if (results.responseMessageType === 'S') {

                    if (results.code === 'R-201') {
                        this.propensityFinalMainData = results.data;
                        this.PropensityFinalData = this.propensityFinalMainData;
                        this.Authstatus = 'All';


                    } else {
                        this.PropensityFinalData = [];
                        this.showToast('ERROR', 'Error', results.responseMessage);
                    }
                }
            );
    }

    private showToast(type: string, title: string, message: string) {
        var toastOptions: ToastOptions = {
            title: title,
            msg: message,
            timeout: 7500
        };
        switch (type) {
            case 'SUCCESS':
                this.toastyService.success(toastOptions);
                break;
            case 'ERROR':
                this.toastyService.error(toastOptions);
                break;
            case 'INFO':
                this.toastyService.info(toastOptions);
                break;
            case 'WARNING':
                this.toastyService.warning(toastOptions);
                break;
            case 'WAIT':
                this.toastyService.wait(toastOptions);
                break;
        }
    }

    private updatePropensityData() {
        console.log('UpdateClicked')

        var res = {
            data: <any>[]
        };

        res.data.push({

            'nr': 1,
            'v1': this.v1,
            'v2': this.v2,
            'v3': this.v3,
            'v4': this.v4,
            'v5': this.v5,
            'v6': this.v6,
            'v7': this.v7,
            'v8': this.v8,
            'v9': this.v9,
            'v10': this.v10
        });

        let saveData = { data: res.data };
        // Call Create API to store the data in database after validations
        this.busy_txn = this.PropensityApi.updatePropensityData(
            this.username,
            this.function_id,
            'U',
            saveData
        )
            .subscribe(
                results => {
                    if (results) {
                        // debugger;
                        if (results.errorCode) {
                            this.errorList = results.errorList;
                            let filedErr: any;
                            filedErr = [];

                            if (this.errorList) {
                                for (let i in this.errorList) {
                                    let item = this.errorList[i];
                                    filedErr.push(item.message + '\n');
                                }
                                let fieldErrMsg = String(filedErr);
                                fieldErrMsg = (fieldErrMsg).replace(',', '');
                                this.showToast('ERROR', 'Error', fieldErrMsg);
                            }

                        } else
                            //  if (results.responseMessageType === 'S') 
                            if (results.code === 'U-201') {
                                this.formError = false;
                                this.showToast('SUCCESS', 'Information', 'Updated Successfully');
                                // this.v1 = 'null';
                                // this.v2 = 'null';
                                // this.v3 = 'null';
                                // this.v4 = 'null';
                                // this.v5 = 'null';
                                // this.v6 = 'null';
                                // this.v7 = 'null';
                                // this.v8 = 'null';
                                // this.v9 = 'null';
                                // this.v10 = 'null';

                            } else {
                                this.showToast('ERROR', 'Error', results.message);
                            }
                    }
                },
                error => {
                    this.logError(error);
                    this.formError = true;
                },
                () => {

                }
            );
    }

    private setBreadCrumb(labels: Array<string>) {
        this.breadcrumb = [];
        if (labels) {
            for (let label of labels) {
                this.breadcrumb.push({ label: label });
            }
        }
    }

    private readPropensityData() {
        this.busy_read = this.PropensityApi.runPropensityData(
            this.username,
            this.function_id,

            'R')
            .subscribe(
                results => {
                    // debugger;

                    if (results.UserRoles) {
                        this.entitlement.Create = results.UserRoles[0].CREATE_ACCESS;
                        this.entitlement.Update = results.UserRoles[0].UPDATE_ACCESS;
                        this.entitlement.Delete = results.UserRoles[0].DELETE_ACCESS;
                        this.entitlement.Authorize = results.UserRoles[0].AUTH;

                    }


                    // if (results.responseMessageType === 'S') {

                    if (results.code === 'R-201') {
                        this.propensityMainData = results.data;
                        this.propensityData = this.propensityMainData;
                        this.Authstatus = 'All';
                        this.v1 = 'null';
                        this.v2 = 'null';
                        this.v3 = 'null';
                        this.v4 = 'null';
                        this.v5 = 'null';
                        this.v6 = 'null';
                        this.v7 = 'null';
                        this.v8 = 'null';
                        this.v9 = 'null';
                        this.v10 = 'null';
                    } else {
                        this.propensityData = [];
                        this.showToast('ERROR', 'Error', results.responseMessage);
                    }
                }
            );
    }

}



