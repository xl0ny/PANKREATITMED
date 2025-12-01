/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PankreatitmedInternalAppDsCriterion {
  /** №1..№11 */
  code?: string;
  description?: string;
  /** "1 календарный день" */
  duration?: string;
  homeVisit?: boolean;
  id?: number;
  imageURL?: string;
  name?: string;
  /** @format float64 */
  refHigh?: number;
  /** @format float64 */
  refLow?: number;
  status?: string;
  /** единиуа измерения */
  unit?: string;
}

export interface PankreatitmedInternalAppDtoRequestAuthenticateMedUser {
  login: string;
  password: string;
}

export interface PankreatitmedInternalAppDtoRequestMedUserRegistration {
  login: string;
  password: string;
}

export interface PankreatitmedInternalAppDtoRequestPankreatitOrderItemUpdate {
  position?: number;
  value_num?: number;
}

export interface PankreatitmedInternalAppDtoRequestUpdateCriterion {
  code?: string;
  description?: string;
  duration?: string;
  home_visit?: boolean;
  image_url?: string;
  name?: string;
  ref_high?: number;
  ref_low?: number;
  unit?: string;
}

export interface PankreatitmedInternalAppDtoRequestUpdateMedUser {
  login?: string;
  password?: string;
}

export interface PankreatitmedInternalAppDtoRequestUpdatePankreatitOrder {
  mortality_risk?: string;
  ranson_score?: number;
  status?: string;
}

export interface PankreatitmedInternalAppDtoResponseAuthorizateUser {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface PankreatitmedInternalAppDtoResponseSendCriterion {
  code?: string;
  description?: string;
  duration?: string;
  home_visit?: boolean;
  id: number;
  image_url?: string;
  name?: string;
  ref_high?: number;
  ref_low?: number;
  status?: string;
  unit?: string;
}

export interface PankreatitmedInternalAppDtoResponseSendMedUserField {
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

export interface PankreatitmedInternalAppDtoResponseSendPankreatitOrder {
  creator_id?: number;
  criteria?: PankreatitmedInternalAppDtoResponseSendPankreatitOrderItem[];
  finished_at?: string;
  formed_at?: string;
  id?: number;
  moderator_id?: number;
  mortality_risk?: string;
  ranson_score?: number;
  status?: string;
}

export interface PankreatitmedInternalAppDtoResponseSendPankreatitOrderItem {
  criterion?: PankreatitmedInternalAppDsCriterion;
  criterion_id?: number;
  id?: number;
  position?: number;
  value_indicator?: boolean;
  value_num?: number;
}

export interface CriteriaListParams {
  /** Поиск по названию (ILIKE) */
  query?: string;
}

export interface CriteriaDetailParams {
  /** ID услуги */
  id: number;
}

export interface CriteriaUpdateParams {
  /** ID услуги */
  id: number;
}

export interface CriteriaDeleteParams {
  /** ID услуги */
  id: number;
}

export interface AddToDraftCreateParams {
  /** ID услуги */
  id: number;
}

export interface ImageCreatePayload {
  /** Изображение (jpg/png/webp) */
  image: File;
}

export interface ImageCreateParams {
  /** ID услуги */
  id: number;
}

export interface PankreatitordersListParams {
  /** Статус (draft|formed|completed|rejected) */
  status?: string;
  /** Дата С (YYYY-MM-DD) */
  from_date?: string;
  /** Дата ПО (YYYY-MM-DD) */
  to_date?: string;
}

export interface ItemsUpdateParams {
  /** ID заявки */
  pankreatit_order_id: number;
  /** ID услуги */
  criterion_id: number;
}

export interface ItemsDeleteParams {
  /** ID заявки */
  pankreatit_order_id: number;
  /** ID услуги */
  criterion_id: number;
}

export interface PankreatitordersDetailParams {
  /** ID заявки */
  id: number;
}

export interface PankreatitordersUpdateParams {
  /** ID заявки */
  id: number;
}

export interface PankreatitordersDeleteParams {
  /** ID заявки */
  id: number;
}

export interface FormUpdateParams {
  /** ID заявки */
  id: number;
}

export interface PutIdParams {
  /** ID заявки */
  id: number;
  /** complete|reject */
  status: string;
}

export interface AuthLogoutCreateParams {
  /** JWT или jti (в зависимости от реализации Logout) */
  token: string;
}

export namespace Id {
  /**
   * No description
   * @tags services
   * @name CriteriaDetail
   * @summary Получить одну услугу
   * @request GET:/criteria/{id}
   * @response `200` `PankreatitmedInternalAppDtoResponseSendCriterion` OK
   * @response `400` `Record<string,any>` bad request
   * @response `404` `Record<string,any>` not found
   */
  export namespace CriteriaDetail {
    export type RequestParams = {
      /** ID услуги */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PankreatitmedInternalAppDtoResponseSendCriterion;
  }

  /**
   * No description
   * @tags services
   * @name CriteriaUpdate
   * @summary Изменить услугу
   * @request PUT:/criteria/{id}
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `404` `Record<string,any>` not found
   */
  export namespace CriteriaUpdate {
    export type RequestParams = {
      /** ID услуги */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PankreatitmedInternalAppDtoRequestUpdateCriterion;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * No description
   * @tags services
   * @name CriteriaDelete
   * @summary Удалить услугу (со встроенным удалением изображения)
   * @request DELETE:/criteria/{id}
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `404` `Record<string,any>` not found
   */
  export namespace CriteriaDelete {
    export type RequestParams = {
      /** ID услуги */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * @description Создаёт черновик автоматически (если нет) и добавляет выбранную услугу
   * @tags services
   * @name AddToDraftCreate
   * @summary Добавить услугу в заявку-черновик
   * @request POST:/criteria/{id}/add-to-draft
   * @secure
   * @response `201` `string` created
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `404` `Record<string,any>` not found
   */
  export namespace AddToDraftCreate {
    export type RequestParams = {
      /** ID услуги */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * @description Загружает файл в MinIO по ID услуги; старое изображение удаляется
   * @tags services
   * @name ImageCreate
   * @summary Загрузить/заменить изображение услуги
   * @request POST:/criteria/{id}/image
   * @secure
   * @response `200` `Record<string,any>` url: ссылка на изображение
   * @response `400` `Record<string,any>` bad request / image is required
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `500` `Record<string,any>` minio/internal error
   */
  export namespace ImageCreate {
    export type RequestParams = {
      /** ID услуги */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ImageCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }

  /**
   * No description
   * @tags orders
   * @name PankreatitordersDetail
   * @summary Получить одну заявку (с позициями)
   * @request GET:/pankreatitorders/{id}
   * @secure
   * @response `200` `Record<string,any>` OK
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `404` `Record<string,any>` not found
   */
  export namespace PankreatitordersDetail {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }

  /**
   * No description
   * @tags orders
   * @name PankreatitordersUpdate
   * @summary Обновить поля заявки (модератор)
   * @request PUT:/pankreatitorders/{id}
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `404` `Record<string,any>` not found
   */
  export namespace PankreatitordersUpdate {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody =
      PankreatitmedInternalAppDtoRequestUpdatePankreatitOrder;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * @description Soft-delete: переводит заявку в статус deleted (только для draft)
   * @tags orders
   * @name PankreatitordersDelete
   * @summary Удалить черновую заявку (создатель)
   * @request DELETE:/pankreatitorders/{id}
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `409` `Record<string,any>` not draft / conflict
   */
  export namespace PankreatitordersDelete {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * @description Проверяет владельца; валидирует обязательные поля; устанавливает дату формирования
   * @tags orders
   * @name FormUpdate
   * @summary Сформировать заявку (создатель)
   * @request PUT:/pankreatitorders/{id}/form
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden (not your order)
   * @response `404` `Record<string,any>` not found
   * @response `409` `Record<string,any>` MedOrderIsNotDraft
   */
  export namespace FormUpdate {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * @description Меняет статус на complete/reject, рассчитывает поля, ставит moderator_id/finished_at
   * @tags orders
   * @name PutId
   * @summary Завершить/отклонить заявку (модератор)
   * @request PUT:/pankreatitorders/{id}/set/{status}
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `409` `Record<string,any>` MedOrderIsNotFormed
   */
  export namespace PutId {
    export type RequestParams = {
      /** ID заявки */
      id: number;
      /** complete|reject */
      status: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }
}

export namespace Cart {
  /**
   * No description
   * @tags orders
   * @name CartList
   * @summary Иконка корзины: черновик и количество позиций
   * @request GET:/pankreatitorders/cart
   * @secure
   * @response `200` `Record<string,any>` OK
   * @response `401` `Record<string,any>` unauthenticated
   * @response `500` `Record<string,any>` internal error
   */
  export namespace CartList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }
}

export namespace Items {
  /**
   * No description
   * @tags order-items
   * @name ItemsUpdate
   * @summary Изменить поля м-м (кол-во/порядок/значение) без PK м-м
   * @request PUT:/pankreatitorders/items
   * @secure
   * @response `200` `Record<string,any>` status: ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `404` `Record<string,any>` not found
   */
  export namespace ItemsUpdate {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ID заявки */
      pankreatit_order_id: number;
      /** ID услуги */
      criterion_id: number;
    };
    export type RequestBody =
      PankreatitmedInternalAppDtoRequestPankreatitOrderItemUpdate;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }

  /**
   * No description
   * @tags order-items
   * @name ItemsDelete
   * @summary Удалить услугу из заявки (м-м) без PK м-м
   * @request DELETE:/pankreatitorders/items
   * @secure
   * @response `200` `Record<string,any>` status: ok
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   * @response `404` `Record<string,any>` not found
   */
  export namespace ItemsDelete {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ID заявки */
      pankreatit_order_id: number;
      /** ID услуги */
      criterion_id: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }
}

export namespace Auth {
  /**
   * @description Проверяет логин/пароль и возвращает JWT (Bearer)
   * @tags auth
   * @name AuthLoginCreate
   * @summary Вход (логин)
   * @request POST:/users/auth/login
   * @response `200` `PankreatitmedInternalAppDtoResponseAuthorizateUser` OK
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` invalid credentials
   */
  export namespace AuthLoginCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody =
      PankreatitmedInternalAppDtoRequestAuthenticateMedUser;
    export type RequestHeaders = {};
    export type ResponseBody =
      PankreatitmedInternalAppDtoResponseAuthorizateUser;
  }

  /**
   * @description Добавляет переданный токен в blacklist до конца срока его действия
   * @tags auth
   * @name AuthLogoutCreate
   * @summary Выход (logout) — поместить токен в blacklist
   * @request POST:/users/auth/logout/{token}
   * @secure
   * @response `200` `Record<string,any>` status/message
   * @response `401` `Record<string,any>` unauthenticated
   * @response `403` `Record<string,any>` forbidden
   * @response `404` `Record<string,any>` token not found / already revoked
   */
  export namespace AuthLogoutCreate {
    export type RequestParams = {
      /** JWT или jti (в зависимости от реализации Logout) */
      token: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, any>;
  }

  /**
   * @description Регистрирует нового пользователя и сразу возвращает JWT (Bearer)
   * @tags auth
   * @name AuthRegisterCreate
   * @summary Регистрация
   * @request POST:/users/auth/register
   * @response `201` `PankreatitmedInternalAppDtoResponseAuthorizateUser` Created
   * @response `400` `Record<string,any>` bad request / weak password
   * @response `409` `Record<string,any>` login already taken
   * @response `500` `Record<string,any>` internal error
   */
  export namespace AuthRegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody =
      PankreatitmedInternalAppDtoRequestMedUserRegistration;
    export type RequestHeaders = {};
    export type ResponseBody =
      PankreatitmedInternalAppDtoResponseAuthorizateUser;
  }
}

export namespace Me {
  /**
   * No description
   * @tags users
   * @name GetMe
   * @summary Личный кабинет: получить мои поля
   * @request GET:/users/me
   * @secure
   * @response `200` `PankreatitmedInternalAppDtoResponseSendMedUserField` OK
   * @response `401` `Record<string,any>` unauthenticated
   * @response `404` `Record<string,any>` not found
   */
  export namespace GetMe {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      PankreatitmedInternalAppDtoResponseSendMedUserField;
  }

  /**
   * No description
   * @tags users
   * @name PutMe
   * @summary Личный кабинет: обновить мои поля
   * @request PUT:/users/me
   * @secure
   * @response `200` `string` ok
   * @response `400` `Record<string,any>` bad request / validation error
   * @response `401` `Record<string,any>` unauthenticated
   * @response `404` `Record<string,any>` not found
   */
  export namespace PutMe {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PankreatitmedInternalAppDtoRequestUpdateMedUser;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title PankreatitMed API
 * @version 1.0
 * @baseUrl /api
 * @contact
 *
 * Ranscon Counter
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Возвращает список критериев (услуг) с фильтрацией по подстроке названия
   *
   * @tags services
   * @name CriteriaList
   * @summary Список услуг
   * @request GET:/criteria
   * @response `200` `PankreatitmedInternalAppDtoResponseSendPankreatitOrder` OK
   * @response `400` `Record<string,any>` bad request
   * @response `500` `Record<string,any>` internal error
   */
  criteriaList = (query: CriteriaListParams, params: RequestParams = {}) =>
    this.http.request<
      PankreatitmedInternalAppDtoResponseSendPankreatitOrder,
      Record<string, any>
    >({
      path: `/criteria`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * @description Создатель видит свои заявки; модератор — все.
   *
   * @tags orders
   * @name PankreatitordersList
   * @summary Список заявок (с фильтрацией по статусу и дате формирования)
   * @request GET:/pankreatitorders
   * @secure
   * @response `200` `Record<string,any>` OK
   * @response `400` `Record<string,any>` bad request
   * @response `401` `Record<string,any>` unauthenticated
   */
  pankreatitordersList = (
    query: PankreatitordersListParams,
    params: RequestParams = {},
  ) =>
    this.http.request<Record<string, any>, Record<string, any>>({
      path: `/pankreatitorders`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  id = {
    /**
     * No description
     *
     * @tags services
     * @name CriteriaDetail
     * @summary Получить одну услугу
     * @request GET:/criteria/{id}
     * @response `200` `PankreatitmedInternalAppDtoResponseSendCriterion` OK
     * @response `400` `Record<string,any>` bad request
     * @response `404` `Record<string,any>` not found
     */
    criteriaDetail: (
      { id, ...query }: CriteriaDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PankreatitmedInternalAppDtoResponseSendCriterion,
        Record<string, any>
      >({
        path: `/criteria/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name CriteriaUpdate
     * @summary Изменить услугу
     * @request PUT:/criteria/{id}
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `404` `Record<string,any>` not found
     */
    criteriaUpdate: (
      { id, ...query }: CriteriaUpdateParams,
      input: PankreatitmedInternalAppDtoRequestUpdateCriterion,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/criteria/${id}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name CriteriaDelete
     * @summary Удалить услугу (со встроенным удалением изображения)
     * @request DELETE:/criteria/{id}
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `404` `Record<string,any>` not found
     */
    criteriaDelete: (
      { id, ...query }: CriteriaDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/criteria/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик автоматически (если нет) и добавляет выбранную услугу
     *
     * @tags services
     * @name AddToDraftCreate
     * @summary Добавить услугу в заявку-черновик
     * @request POST:/criteria/{id}/add-to-draft
     * @secure
     * @response `201` `string` created
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `404` `Record<string,any>` not found
     */
    addToDraftCreate: (
      { id, ...query }: AddToDraftCreateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/criteria/${id}/add-to-draft`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает файл в MinIO по ID услуги; старое изображение удаляется
     *
     * @tags services
     * @name ImageCreate
     * @summary Загрузить/заменить изображение услуги
     * @request POST:/criteria/{id}/image
     * @secure
     * @response `200` `Record<string,any>` url: ссылка на изображение
     * @response `400` `Record<string,any>` bad request / image is required
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `500` `Record<string,any>` minio/internal error
     */
    imageCreate: (
      { id, ...query }: ImageCreateParams,
      data: ImageCreatePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, any>, Record<string, any>>({
        path: `/criteria/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name PankreatitordersDetail
     * @summary Получить одну заявку (с позициями)
     * @request GET:/pankreatitorders/{id}
     * @secure
     * @response `200` `Record<string,any>` OK
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `404` `Record<string,any>` not found
     */
    pankreatitordersDetail: (
      { id, ...query }: PankreatitordersDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, any>, Record<string, any>>({
        path: `/pankreatitorders/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name PankreatitordersUpdate
     * @summary Обновить поля заявки (модератор)
     * @request PUT:/pankreatitorders/{id}
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `404` `Record<string,any>` not found
     */
    pankreatitordersUpdate: (
      { id, ...query }: PankreatitordersUpdateParams,
      input: PankreatitmedInternalAppDtoRequestUpdatePankreatitOrder,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/pankreatitorders/${id}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Soft-delete: переводит заявку в статус deleted (только для draft)
     *
     * @tags orders
     * @name PankreatitordersDelete
     * @summary Удалить черновую заявку (создатель)
     * @request DELETE:/pankreatitorders/{id}
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `409` `Record<string,any>` not draft / conflict
     */
    pankreatitordersDelete: (
      { id, ...query }: PankreatitordersDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/pankreatitorders/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет владельца; валидирует обязательные поля; устанавливает дату формирования
     *
     * @tags orders
     * @name FormUpdate
     * @summary Сформировать заявку (создатель)
     * @request PUT:/pankreatitorders/{id}/form
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden (not your order)
     * @response `404` `Record<string,any>` not found
     * @response `409` `Record<string,any>` MedOrderIsNotDraft
     */
    formUpdate: (
      { id, ...query }: FormUpdateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/pankreatitorders/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Меняет статус на complete/reject, рассчитывает поля, ставит moderator_id/finished_at
     *
     * @tags orders
     * @name PutId
     * @summary Завершить/отклонить заявку (модератор)
     * @request PUT:/pankreatitorders/{id}/set/{status}
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `409` `Record<string,any>` MedOrderIsNotFormed
     */
    putId: (
      { id, status, ...query }: PutIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/pankreatitorders/${id}/set/${status}`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  cart = {
    /**
     * No description
     *
     * @tags orders
     * @name CartList
     * @summary Иконка корзины: черновик и количество позиций
     * @request GET:/pankreatitorders/cart
     * @secure
     * @response `200` `Record<string,any>` OK
     * @response `401` `Record<string,any>` unauthenticated
     * @response `500` `Record<string,any>` internal error
     */
    cartList: (params: RequestParams = {}) =>
      this.http.request<Record<string, any>, Record<string, any>>({
        path: `/pankreatitorders/cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  items = {
    /**
     * No description
     *
     * @tags order-items
     * @name ItemsUpdate
     * @summary Изменить поля м-м (кол-во/порядок/значение) без PK м-м
     * @request PUT:/pankreatitorders/items
     * @secure
     * @response `200` `Record<string,any>` status: ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `404` `Record<string,any>` not found
     */
    itemsUpdate: (
      query: ItemsUpdateParams,
      input: PankreatitmedInternalAppDtoRequestPankreatitOrderItemUpdate,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, any>, Record<string, any>>({
        path: `/pankreatitorders/items`,
        method: "PUT",
        query: query,
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags order-items
     * @name ItemsDelete
     * @summary Удалить услугу из заявки (м-м) без PK м-м
     * @request DELETE:/pankreatitorders/items
     * @secure
     * @response `200` `Record<string,any>` status: ok
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` unauthenticated
     * @response `404` `Record<string,any>` not found
     */
    itemsDelete: (query: ItemsDeleteParams, params: RequestParams = {}) =>
      this.http.request<Record<string, any>, Record<string, any>>({
        path: `/pankreatitorders/items`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Проверяет логин/пароль и возвращает JWT (Bearer)
     *
     * @tags auth
     * @name AuthLoginCreate
     * @summary Вход (логин)
     * @request POST:/users/auth/login
     * @response `200` `PankreatitmedInternalAppDtoResponseAuthorizateUser` OK
     * @response `400` `Record<string,any>` bad request
     * @response `401` `Record<string,any>` invalid credentials
     */
    authLoginCreate: (
      input: PankreatitmedInternalAppDtoRequestAuthenticateMedUser,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PankreatitmedInternalAppDtoResponseAuthorizateUser,
        Record<string, any>
      >({
        path: `/users/auth/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет переданный токен в blacklist до конца срока его действия
     *
     * @tags auth
     * @name AuthLogoutCreate
     * @summary Выход (logout) — поместить токен в blacklist
     * @request POST:/users/auth/logout/{token}
     * @secure
     * @response `200` `Record<string,any>` status/message
     * @response `401` `Record<string,any>` unauthenticated
     * @response `403` `Record<string,any>` forbidden
     * @response `404` `Record<string,any>` token not found / already revoked
     */
    authLogoutCreate: (
      { token, ...query }: AuthLogoutCreateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, any>, Record<string, any>>({
        path: `/users/auth/logout/${token}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Регистрирует нового пользователя и сразу возвращает JWT (Bearer)
     *
     * @tags auth
     * @name AuthRegisterCreate
     * @summary Регистрация
     * @request POST:/users/auth/register
     * @response `201` `PankreatitmedInternalAppDtoResponseAuthorizateUser` Created
     * @response `400` `Record<string,any>` bad request / weak password
     * @response `409` `Record<string,any>` login already taken
     * @response `500` `Record<string,any>` internal error
     */
    authRegisterCreate: (
      input: PankreatitmedInternalAppDtoRequestMedUserRegistration,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PankreatitmedInternalAppDtoResponseAuthorizateUser,
        Record<string, any>
      >({
        path: `/users/auth/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  me = {
    /**
     * No description
     *
     * @tags users
     * @name GetMe
     * @summary Личный кабинет: получить мои поля
     * @request GET:/users/me
     * @secure
     * @response `200` `PankreatitmedInternalAppDtoResponseSendMedUserField` OK
     * @response `401` `Record<string,any>` unauthenticated
     * @response `404` `Record<string,any>` not found
     */
    getMe: (params: RequestParams = {}) =>
      this.http.request<
        PankreatitmedInternalAppDtoResponseSendMedUserField,
        Record<string, any>
      >({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name PutMe
     * @summary Личный кабинет: обновить мои поля
     * @request PUT:/users/me
     * @secure
     * @response `200` `string` ok
     * @response `400` `Record<string,any>` bad request / validation error
     * @response `401` `Record<string,any>` unauthenticated
     * @response `404` `Record<string,any>` not found
     */
    putMe: (
      input: PankreatitmedInternalAppDtoRequestUpdateMedUser,
      params: RequestParams = {},
    ) =>
      this.http.request<string, Record<string, any>>({
        path: `/users/me`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
