import Form, { FormComponentProps } from 'antd/es/form';
import { Input, Button, Radio, Drawer, Select, Col, Row, Icon, List } from 'antd';
import React, { useState } from 'react';
import { EventsMeta, Parameter } from '../data.d';
import styles from '../index.less';
import { renderUnit } from '@/pages/device/public';
import Paramter from '../paramter';

interface Props extends FormComponentProps {
  save: Function;
  data: Partial<EventsMeta>;
  close: Function;
}

interface State {
  editVisible: boolean;
  current: Partial<Parameter>;
  data: Partial<EventsMeta>;
  dataType: string;
  enumData: any[];
  parameterVisible: boolean;
  parameter: any[];
  currentParameter: any;
  properties: any[];
}

const EventDefin: React.FC<Props> = props => {
  const initState: State = {
    editVisible: false,
    current: {},
    data: props.data || {},
    dataType: props.data.valueType?.type || '',
    enumData: props.data.valueType?.properties || [{ key: '', value: '', id: 0 }],
    properties: props.data.valueType?.properties || [],
    parameterVisible: false,
    currentParameter: {},
    parameter: [],
  };

  // const [data, setData] = useState(initState.data);
  // const [editVisible, setEditVisible] = useState(initState.editVisible);
  const [properties, setParameter] = useState(initState.properties);
  const [dataType, setDataType] = useState(initState.dataType);
  const [enumData, setEnumData] = useState(initState.enumData);
  const [parameterVisible, setParameterVisible] = useState(initState.parameterVisible);
  const [currentParameter, setCurrentParameter] = useState(initState.currentParameter);

  const {
    form: { getFieldDecorator },
  } = props;

  const saveData = () => {
    const {
      form,
      // data: { id },
    } = props;
    form.validateFields((err: any, fieldValue: any) => {
      if (err) return;
      // ToDo保存数据
      const data = fieldValue;

      const {
        valueType: { type },
      } = fieldValue;

      if (type === 'object') {
        data.valueType.properties = properties;
      } else if (type === 'enum') {
        data.valueType.properties = enumData;
      }
      props.save({ ...data });
    });
  };

  const renderDataType = () => {
    switch (dataType) {
      case 'float':
      case 'double':
      case 'int':
        return (
          <div>
            <Form.Item label="取值范围" style={{ height: 69 }}>
              <Col span={11}>
                {getFieldDecorator('valueType.min', {
                  rules: [{ required: true, message: '请输入最小值' }],
                  initialValue: initState.data.valueType?.min,
                })(<Input placeholder="最小值" />)}
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('valueType.max', {
                    rules: [{ required: true, message: '请输入最大值' }],
                    initialValue: initState.data.valueType?.max,
                  })(<Input placeholder="最大值" />)}
                </Form.Item>
              </Col>
            </Form.Item>

            <Form.Item label="步长">
              {getFieldDecorator('valueType.step', {
                rules: [{ required: true, message: '请输入步长' }],
                initialValue: initState.data.valueType?.step,
              })(<Input placeholder="请输入步长" />)}
            </Form.Item>
            <Form.Item label="单位">
              {getFieldDecorator('valueType.unit', {
                rules: [{ required: true, message: '请选择单位' }],
                initialValue: initState.data.valueType?.unit,
              })(renderUnit())}
            </Form.Item>
          </div>
        );
      case 'string':
        return (
          <div>
            <Form.Item label="数据长度">
              {getFieldDecorator('valueType.length', {
                rules: [{ required: true, message: '请输入数据长度' }],
                initialValue: initState.data.valueType?.length,
              })(<Input addonAfter="字节" />)}
            </Form.Item>
          </div>
        );
      case 'bool':
        return (
          <div>
            <Form.Item label="布尔值">
              {getFieldDecorator('valueType.true', {
                rules: [{ required: true, message: '请输入对应数据' }],
                initialValue: initState.data.valueType?.true,
              })(<Input addonBefore="0" placeholder="如：关" />)}
              <Form.Item>
                {getFieldDecorator('valueType.false', {
                  rules: [{ required: false }],
                  initialValue: initState.data.valueType?.false,
                })(<Input addonBefore="1" placeholder="如：开" />)}
              </Form.Item>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              {getFieldDecorator('dateTemplate', {
                initialValue: initState.data.valueType?.dateTemplate,
              })(
                <Select>
                  <Select.Option value="string">String类型的UTC时间戳 (毫秒)</Select.Option>
                  <Select.Option value="yyyy-MM-dd">yyyy-MM-dd</Select.Option>
                  <Select.Option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</Select.Option>
                  <Select.Option value="yyyy-MM-dd HH:mm:ss EE">
                    yyyy-MM-dd HH:mm:ss EE
                  </Select.Option>
                  <Select.Option value="yyyy-MM-dd HH:mm:ss zzz">
                    yyyy-MM-dd HH:mm:ss zzz
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          </div>
        );
      case 'array':
        return (
          <div>
            <Form.Item label="元素类型">
              {getFieldDecorator('valueType.arrayType', {
                rules: [{ required: true }],
                initialValue: initState.data.valueType?.arrayType,
              })(
                <Radio.Group>
                  <Radio value="int32">int32(整数型)</Radio>
                  <Radio value="float">float(单精度）</Radio>
                  <Radio value="double">double(双精度)</Radio>
                  <Radio value="text">text(字符串)</Radio>
                  <Radio value="object">object(结构体)</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="元素个数">
              {getFieldDecorator('valueType.elementNumber', {
                rules: [{ required: true }],
                initialValue: initState.data.valueType?.elementNumber,
              })(<Input />)}
            </Form.Item>
          </div>
        );
      case 'enum':
        return (
          <div>
            <Form.Item label="枚举项">
              {enumData.map((item, index) => (
                <Row key={item.id}>
                  <Col span={10}>
                    <Input
                      placeholder="编号为：0"
                      value={item.value}
                      onChange={event => {
                        enumData[index].value = event.target.value;
                        setEnumData([...enumData]);
                      }}
                    />
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    <Icon type="arrow-right" />
                  </Col>
                  <Col span={10}>
                    <Input
                      placeholder="对该枚举项的描述"
                      value={item.key}
                      onChange={event => {
                        enumData[index].key = event.target.value;
                        setEnumData([...enumData]);
                      }}
                    />
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    {index === 0 ? (
                      <Icon
                        type="plus-circle"
                        onClick={() => {
                          setEnumData([...enumData, { id: enumData.length + 1 }]);
                        }}
                      />
                    ) : (
                      <Icon
                        type="minus-circle"
                        onClick={() => {
                          enumData.splice(index, 1);
                          setEnumData([...enumData]);
                        }}
                      />
                    )}
                  </Col>
                </Row>
              ))}
            </Form.Item>
          </div>
        );
      case 'object':
        return (
          <Form.Item label="JSON对象">
            {properties.length > 0 && (
              <List
                bordered
                dataSource={properties}
                renderItem={(item: any) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => {
                          setParameterVisible(true);
                          setCurrentParameter(item);
                        }}
                      >
                        编辑
                      </Button>,
                      <Button
                        type="link"
                        onClick={() => {
                          const index = properties.findIndex((i: any) => i.id === item.id);
                          properties.splice(index, 1);
                          setParameter([...properties]);
                        }}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    参数名称：{item.name}
                  </List.Item>
                )}
              />
            )}
            <Button
              type="link"
              onClick={() => {
                setParameterVisible(true);
                setCurrentParameter({});
              }}
            >
              <Icon type="plus" />
              添加参数
            </Button>
          </Form.Item>
        );
      case 'file':
        return (
          <Form.Item label="文件类型">
            {getFieldDecorator('valueType.fileType', {
              rules: [{ required: true }],
              initialValue: initState.data.valueType?.fileType,
            })(
              <Select>
                <Select.Option value="url">URL(链接)</Select.Option>
                <Select.Option value="base64">Base64(Base64编码)</Select.Option>
                <Select.Option value="binary">Binary(二进制)</Select.Option>
              </Select>,
            )}
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      title="编辑事件定义"
      placement="right"
      closable={false}
      onClose={() => props.close()}
      visible
      width="30%"
    >
      <Form className={styles.paramterForm}>
        <Form.Item label="事件标识">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入事件标识' }],
            initialValue: initState.data.id,
          })(
            <Input
              disabled={!!initState.data.id}
              style={{ width: '100%' }}
              placeholder="请输入事件标识"
            />,
          )}
        </Form.Item>
        <Form.Item label="事件名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入事件名称' }],
            initialValue: initState.data.name,
          })(<Input placeholder="请输入事件名称" />)}
        </Form.Item>
        <Form.Item label="事件类型">
          {getFieldDecorator('expands.eventType', {
            rules: [{ required: true }],
            initialValue: initState.data.expands?.eventType,
          })(
            <Radio.Group>
              <Radio value="reportData">数据上报</Radio>
              <Radio value="event">事件上报</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label="事件级别">
          {getFieldDecorator('expands.level', {
            rules: [{ required: true }],
            initialValue: initState.data.expands?.level,
          })(
            <Radio.Group>
              <Radio value="ordinary">普通</Radio>
              <Radio value="warn">警告</Radio>
              <Radio value="urgent">紧急</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label="输出参数">
          {getFieldDecorator('valueType.type', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: initState.data.valueType?.type,
          })(
            <Select
              placeholder="请选择"
              onChange={(value: string) => {
                setDataType(value);
              }}
            >
              <Select.OptGroup label="基本类型">
                <Select.Option value="int">int(整数型)</Select.Option>
                <Select.Option value="double">double(双精度浮点数)</Select.Option>
                <Select.Option value="float">float(单精度浮点数)</Select.Option>
                <Select.Option value="string">text(字符串)</Select.Option>
                <Select.Option value="bool">bool(布尔型)</Select.Option>
                <Select.Option value="date">date(时间型)</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="其他类型">
                <Select.Option value="enum">enum(枚举)</Select.Option>
                <Select.Option value="array">array(数组)</Select.Option>
                <Select.Option value="object">object(结构体)</Select.Option>
              </Select.OptGroup>
            </Select>,
          )}
        </Form.Item>
        {renderDataType()}
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            initialValue: initState.data.description,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
      </Form>
      {parameterVisible && (
        <Paramter
          data={currentParameter}
          save={item => {
            const temp = properties.filter(i => i.id !== item.id);
            setParameter([...temp, item]);
          }}
          close={() => setParameterVisible(false)}
        />
      )}
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

export default Form.create<Props>()(EventDefin);
