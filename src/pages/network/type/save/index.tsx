import React, { useState, useEffect } from 'react';
import { Form, Input, Drawer, Button, Select, Radio, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  data: any;
  save: Function;
}
interface State {
  dataType: string;
  supportsType: any[];
  certificateList: any[];
  tcpServerParseType: string;
}
const Save: React.FC<Props> = props => {
  const initState: State = {
    dataType: props.data.type?.value,
    supportsType: [],
    certificateList: [],
    tcpServerParseType: props.data?.configuration?.parserType || 'DIRECT',
  };
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [dataType, setDataType] = useState(initState.dataType);
  const [supportsType, setSupportsType] = useState(initState.supportsType);
  const [certificateList, setCertificateList] = useState(initState.certificateList);
  const [tcpServerParseType, setTcpServerParseType] = useState(initState.tcpServerParseType);

  useEffect(() => {
    apis.network
      .support()
      .then(response => {
        setSupportsType(response.result);
      })
      .catch(() => {});
    apis.certificate
      .listNoPaging({ paging: false })
      .then(response => {
        setCertificateList(response.result);
      })
      .catch(() => {});
  }, []);

  const renderTcpServerParse = () => {
    switch (tcpServerParseType) {
      case 'delimited':
        return (
          <Form.Item label="分隔符">
            {getFieldDecorator('configuration.delimited', {
              initialValue: props.data?.configuration?.delimited,
            })(<Input />)}
          </Form.Item>
        );
      case 'script':
        return (
          <>
            <Form.Item label="脚本语言">
              {getFieldDecorator('configuration.lang', {
                initialValue: props.data?.configuration?.lang,
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="javascript">JavaScript</Radio.Button>
                  <Radio.Button value="groovy">Groovy</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="解析脚本">
              {getFieldDecorator('configuration.script', {
                initialValue: props.data?.configuration?.script,
              })(<Input.TextArea rows={3} />)}
            </Form.Item>
          </>
        );
      case 'fixed_length':
        return (
          <Form.Item label="长度值">
            {getFieldDecorator('configuration.size', {
              initialValue: props.data?.configuration?.size,
            })(<Input />)}
          </Form.Item>
        );
      default:
        return null;
    }
  };
  const renderForm = () => {
    switch (dataType) {
      case 'MQTT_SERVER':
        return (
          <div>
            <Form.Item label="线程数">
              {getFieldDecorator('configuration.instance', {
                initialValue: props.data?.configuration?.instance,
              })(<InputNumber min={1} style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="HOST">
              {getFieldDecorator('configuration.host', {
                initialValue: props.data?.configuration?.host,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="TLS">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </div>
        );
      case 'MQTT_CLIENT':
        return (
          <div>
            <Form.Item label="clientId">
              {getFieldDecorator('configuration.clientId', {
                initialValue: props.data?.configuration?.clientId,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="HOST">
              {getFieldDecorator('configuration.host', {
                initialValue: props.data?.configuration?.host,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="TLS">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="用户名">
              {getFieldDecorator('configuration.username', {
                initialValue: props.data?.configuration?.username,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('configuration.password', {
                initialValue: props.data?.configuration?.password,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      case 'TCP_SERVER':
        return (
          <div>
            <Form.Item label="开启SSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="HOST">
              {getFieldDecorator('configuration.host', {
                initialValue: props.data?.configuration?.host,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="解析方式">
              {getFieldDecorator('configuration.parserType', {
                initialValue: props.data?.configuration?.parserType,
              })(
                <Select
                  onChange={(e: string) => {
                    setTcpServerParseType(e);
                  }}
                >
                  <Select.Option value="DIRECT">不处理</Select.Option>
                  <Select.Option value="delimited">分隔符</Select.Option>
                  <Select.Option value="script">自定义脚本</Select.Option>
                  <Select.Option value="fixed_length">固定长度</Select.Option>
                </Select>,
              )}
            </Form.Item>
            {renderTcpServerParse()}
          </div>
        );
      case 'TCP_CLIENT':
        return (
          <div>
            <Form.Item label="开启SSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="HOST">
              {getFieldDecorator('configuration.host', {
                initialValue: props.data?.configuration?.host,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="解析方式">
              {getFieldDecorator('configuration.parserType', {
                initialValue: props.data?.configuration?.parserType,
              })(
                <Select
                  onChange={(e: string) => {
                    setTcpServerParseType(e);
                  }}
                >
                  <Select.Option value="DIRECT">不处理</Select.Option>
                  <Select.Option value="DELIMITED">分隔符</Select.Option>
                  <Select.Option value="SCRIPT">自定义脚本</Select.Option>
                  <Select.Option value="FIXED_LENGTH">固定长度</Select.Option>
                </Select>,
              )}
            </Form.Item>
            {renderTcpServerParse()}
          </div>
        );
      case 'COAP_SERVER':
        return (
          <div>
            <Form.Item label="address">
              {getFieldDecorator('configuration.address', {
                initialValue: props.data?.configuration?.address,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="开启DTSL">
              {getFieldDecorator('configuration.enableDtls', {
                initialValue: props.data?.configuration?.enableDtls,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="私钥别名">
              {getFieldDecorator('configuration.privateKeyAlias', {
                initialValue: props.data?.configuration?.privateKeyAlias,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </div>
        );
      case 'COAP_CLIENT':
        return (
          <div>
            <Form.Item label="URL">
              {getFieldDecorator('configuration.url', {
                initialValue: props.data?.configuration?.url,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="超时时间">
              {getFieldDecorator('configuration.timeout', {
                initialValue: props.data?.configuration?.timeout,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="开启DTSL">
              {getFieldDecorator('configuration.enableDtls', {
                initialValue: props.data?.configuration?.enableDtls,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </div>
        );
      case 'HTTP_SERVER':
        return (
          <div>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="开启SSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </div>
        );
      case 'HTTP_CLIENT':
        return (
          <div>
            <Form.Item label="baseUrl">
              {getFieldDecorator('configuration.baseUrl', {
                initialValue: props.data?.configuration?.baseUrl,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="开启SSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="验证HOST">
              {getFieldDecorator('configuration.verifyHost', {
                initialValue: props.data?.configuration?.verifyHost,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="信任所有证书">
              {getFieldDecorator('configuration.trustAll', {
                initialValue: props.data?.configuration?.trustAll,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </div>
        );
      case 'WEB_SOCKET_SERVER':
        return (
          <div>
            <Form.Item label="线程数">
              {getFieldDecorator('configuration.instance', {
                initialValue: props.data?.configuration?.instance,
              })(<InputNumber min={1} style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="开启SSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="HOST">
              {getFieldDecorator('configuration.host', {
                initialValue: props.data?.configuration?.host,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      case 'WEB_SOCKET_CLIENT':
        return (
          <div>
            <Form.Item label="uri">
              {getFieldDecorator('configuration.uri', {
                initialValue: props.data?.configuration?.uri,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="开启SSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="验证HOST">
              {getFieldDecorator('configuration.verifyHost', {
                initialValue: props.data?.configuration?.verifyHost,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="HOST">
              {getFieldDecorator('configuration.host', {
                initialValue: props.data?.configuration?.host,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PORT">
              {getFieldDecorator('configuration.port', {
                initialValue: props.data?.configuration?.port,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      case 'UDP':
        return (
          <div>
            <Form.Item label="开启DTSL">
              {getFieldDecorator('configuration.ssl', {
                initialValue: props.data?.configuration?.ssl,
              })(
                <Radio.Group>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="证书">
              {getFieldDecorator('configuration.certId', {
                initialValue: props.data?.configuration?.certId,
              })(
                <Select>
                  {certificateList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="私钥别名">
              {getFieldDecorator('configuration.privateKeyAlias', {
                initialValue: props.data?.configuration?.privateKeyAlias,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="远程地址">
              {getFieldDecorator('configuration.remoteAddress', {
                initialValue: props.data?.configuration?.remoteAddress,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="远程端口">
              {getFieldDecorator('configuration.remotePort', {
                initialValue: props.data?.configuration?.remotePort,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="本地地址">
              {getFieldDecorator('configuration.localAddress', {
                initialValue: props.data?.configuration?.localAddress,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="本地端口">
              {getFieldDecorator('configuration.localPort', {
                initialValue: props.data?.configuration?.localPort,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  const saveData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      const { id } = props.data;
      props.save({ id, ...fileValue });
    });
  };
  return (
    <Drawer
      title={`${props.data.id ? '编辑' : '新建'}网络组件`}
      visible
      onClose={() => props.close()}
      width="30VW"
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="组件名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入组件名称' }],
            initialValue: props.data?.name,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="组件类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择组件类型' }],
            initialValue: props.data?.type?.value,
          })(
            <Select
              onChange={(value: string) => {
                setDataType(value);
              }}
            >
              {supportsType.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        {renderForm()}
        <Form.Item label="描述">
          {getFieldDecorator('describe', {})(<Input.TextArea rows={3} />)}
        </Form.Item>
      </Form>

      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<Props>()(Save);
