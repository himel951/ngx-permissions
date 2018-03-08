import { Component, Renderer2, TemplateRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPermissionsModule } from '../index';
import { NgxPermissionsService } from '../service/permissions.service';
import { NgxPermissionsConfigurationService } from '../service/configuration.service';
import { NgxPermissionsPredefinedStrategies } from '../enums/predefined-strategies.enum';

enum PermissionsTestEnum {
    ADMIN = <any> 'ADMIN',
    GUEST = <any> 'GUEST'
}

describe('Permission directive angular only configuration', () => {
    @Component({selector: 'test-comp',
        template: `<button  *ngxPermissionsOnly="'ADMIN'"><div>123</div></button>`})
    class TestComp {
        data: any;
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: NgxPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
          renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [NgxPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(NgxPermissionsService);
        configurationService = fixture.debugElement.injector.get(NgxPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });


    it('Should disable component when default method is defined', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);
        configurationService.setDefaultOnAuthorizedStrategy(disable);
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);

    }));

    it ('Should show the component when predefined show strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnAuthorizedStrategy(NgxPermissionsPredefinedStrategies.SHOW);
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnAuthorizedStrategy(NgxPermissionsPredefinedStrategies.REMOVE);
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBe(null);
    }));

    it('Should disable component when default unauthorized method is defined', fakeAsync(() => {
        configurationService.addPermissionStrategy(disable, disableFunction);
        configurationService.setDefaultOnUnauthorizedMethod(disable);
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);

    }));

    it ('Should show the component when predefined default unauthorized show strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnUnauthorizedMethod(NgxPermissionsPredefinedStrategies.SHOW);
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

    it ('Should remove the component when predefined default unauthorized remove strategy is selected', fakeAsync(() => {
        configurationService.setDefaultOnUnauthorizedMethod(NgxPermissionsPredefinedStrategies.REMOVE);
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBe(null);
    }));
});


describe('Permission directive angular strategies configuration passed by template', () => {
    @Component({selector: 'test-comp',
        template: `<button  *ngxPermissionsOnly="'ADMIN'; authorisedStrategy: 'remove'; unauthorisedStrategy: 'show'" ngxPermissionsUnAuthorisedStrategy="show"><div>123</div></button>`})
    class TestComp {
        data: any;
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: NgxPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [NgxPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(NgxPermissionsService);
        configurationService = fixture.debugElement.injector.get(NgxPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should hide the component when predefined hide strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toEqual(null);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

});


describe('Permission directive angular strategies configuration passed by template except', () => {
    @Component({selector: 'test-comp',
        template: `<button  *ngxPermissionsExcept="'ADMIN'; authorisedStrategy: 'remove'; unauthorisedStrategy: 'show'"><div>123</div></button>`})
    class TestComp {
        data: any;

    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: NgxPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>';
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [NgxPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(NgxPermissionsService);
        configurationService = fixture.debugElement.injector.get(NgxPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should hide the component when predefined hide strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toEqual(null);
    }));

    it ('Should show the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN,  PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.innerHTML).toEqual(correctTemplate);
    }));

});


describe('Permission directive angular strategies as function configuration passed by template', () => {
    @Component({selector: 'test-comp',
        template: `<button  *ngxPermissionsOnly="'ADMIN'; authorisedStrategy: disabled; unauthorisedStrategy: disabled"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: NgxPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [NgxPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(NgxPermissionsService);
        configurationService = fixture.debugElement.injector.get(NgxPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

});

describe('Permission directive angular strategies as function configuration passed by template except permissions', () => {
    @Component({selector: 'test-comp',
        template: `<button  *ngxPermissionsExcept="'ADMIN'; authorisedStrategy: disabled; unauthorisedStrategy: disabled"><div>123</div></button>`})
    class TestComp {
        data: any;
        public disabled(templateRef: TemplateRef<any>) {
            templateRef.elementRef.nativeElement.nextSibling.setAttribute('disabled', true)
        }
    }

    let permissionService;
    let permissions;
    let fixture;
    let comp;
    let configurationService: NgxPermissionsConfigurationService;
    const disable = 'disable';
    let renderer: Renderer2;
    let correctTemplate = '<div>123</div>'
    let disableFunction = (tF: TemplateRef<any>) => {
        renderer.setAttribute(tF.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    };
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [NgxPermissionsModule.forRoot()], providers:[Renderer2]});

        fixture = TestBed.createComponent(TestComp);
        comp = fixture.componentInstance;

        permissionService = fixture.debugElement.injector.get(NgxPermissionsService);
        configurationService = fixture.debugElement.injector.get(NgxPermissionsConfigurationService);
        renderer = fixture.debugElement.injector.get(Renderer2);

    });

    it ('Should disable the component when disabled function is passed', fakeAsync(() => {
        permissionService.loadPermissions([PermissionsTestEnum.ADMIN, PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

    it ('Should remove the component when predefined remove strategy is selected', fakeAsync(() => {
        permissionService.loadPermissions([ PermissionsTestEnum.GUEST]);
        detectChanges(fixture);

        let content = fixture.debugElement.nativeElement.querySelector('button');
        expect(content).toBeTruthy();
        expect(content.disabled).toEqual(true);
    }));

});

function detectChanges(fixture) {
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

}
