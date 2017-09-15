import {Injectable} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {getDOM} from "@angular/platform-browser-dynamic/testing/private_import_platform-browser";
//import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

@Injectable()

export class SeoService {
  /**
   * Angular 2 Title Service
   */
  private titleServiceMeta:Title;
  /**
   * <head> Element of the HTML document
   */
  private headElement:HTMLElement;
  /**
   * <head> Element of the HTML document
   */
  private metaDescription:HTMLElement;
  private metaOgDescription:HTMLElement;
  private metaOgTitle:HTMLElement;
  private metaOgImage:HTMLElement;
  /**
   * <head> Element of the HTML document
   */
  private robots:HTMLElement;
  private DOM:any;

  /**
   * Inject the Angular 2 Title Service
   * @param titleService
   */
  constructor(private titleService:Title) {
    this.titleServiceMeta = titleService;
    this.DOM = getDOM();

    /**
     * get the <head> Element
     * @type {any}
     */
    this.headElement = this.DOM.query('head');
    this.metaDescription = this.getOrCreateMetaElement('description');
    this.metaOgDescription = this.getOrCreateMetaElement("'og:description'");
    this.metaOgTitle = this.getOrCreateMetaElement("'og:title'");
    this.metaOgImage = this.getOrCreateMetaElement("'og:image'");
    this.robots = this.getOrCreateMetaElement('robots');
  }

  public getTitle():string {
    return this.titleServiceMeta.getTitle();
  }

  public setTitle(newTitle:string) {
    this.titleServiceMeta.setTitle(newTitle);
  }

  public getMetaDescription():string {
    return this.metaDescription.getAttribute('content');
  }

  public setMetaDescription(description:string) {
    this.metaDescription.setAttribute('content', description);
  }

  public getMetaOgDescription():string {
    return this.metaOgDescription.getAttribute('content');
  }

  public setMetaOgDescription(OgDescription:string) {
    this.metaOgDescription.setAttribute('content', OgDescription);
  }

  public getMetaOgImage():string {
    return this.metaOgImage.getAttribute('content');
  }

  public setMetaOgImage(OgImage:string) {
    this.metaOgImage.setAttribute('content', OgImage);
  }

  public getMetaOgTitle():string {
    return this.metaOgTitle.getAttribute('content');
  }

  public setMetaOgTitle(OgTitle:string) {
    this.metaOgTitle.setAttribute('content', OgTitle);
  }

  public getMetaRobots():string {
    return this.robots.getAttribute('content');
  }

  public setMetaRobots(robots:string) {
    this.robots.setAttribute('content', robots);
  }

  /**
   * get the HTML Element when it is in the markup, or create it.
   * @param name
   * @returns {HTMLElement}
   */
  private getOrCreateMetaElement(name:string):HTMLElement {
    let el:HTMLElement;
    el = this.DOM.query('meta[name=' + name + ']');
    if (el === null) {
      el = this.DOM.createElement('meta');
      el.setAttribute('name', name);
      this.headElement.appendChild(el);
    }
    return el;
  }

}