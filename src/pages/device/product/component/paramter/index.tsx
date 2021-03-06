import { Form, Input, Select, Col, Button, Radio, Drawer, Icon, Row, List, message } from 'antd';
import React, { useState } from 'react';
import styles from '../index.less';
import { groupBy } from 'lodash';
import { units, Unit } from '@/utils/unit';

interface Props {
  save: (data: any) => void;
  close: Function;
  data: any;
}

interface State {
  dataType: string;
  parameterVisible: boolean;
  data: any;
  enumData: any[];
  currentParameter: any;
}

const Paramter: React.FC<Props> = props => {
  const initState: State = {
    dataType: props.data.valueType?.type || '',
    parameterVisible: false,
    data: { ...props.data },
    enumData: props.data.valueType?.properties || [{ key: '', value: '', id: 0 }],
    currentParameter: {},
  };
  const [dataType, setDataType] = useState(initState.dataType);
  const [parameterVisible, setParameterVisible] = useState(initState.parameterVisible);
  const [data, setData] = useState(initState.data);
  const [currentParameter, setCurrentParameter] = useState(initState.currentParameter);
  const [enumData, setEnumData] = useState(initState.enumData);

  const dataTypeChange = (value: string) => {
    setDataType(value);
  };

  const renderDetailForm = () => {
    switch (dataType) {
      case 'int':
      case 'double':
      case 'float':
        return (
          <div>
            <Form.Item label="取值范围" style={{ height: 69 }}>
              <Col span={11}>
                <Input
                  value={data.valueType.min}
                  placeholder="最小值"
                  onChange={event => {
                    data.valueType.min = event.target.value;
                    setData({ ...data });
                  }}
                />
              </Col>
              <Col span={2} push={1}>
                ~
              </Col>
              <Col span={11}>
                <Form.Item>
                  <Input
                    value={data.valueType.max}
                    placeholder="最大值"
                    onChange={event => {
                      data.valueType.max = event.target.value;
                      setData({ ...data });
                    }}
                  />
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item label="单位">
              <Select
                onChange={(value: string) => {
                  data.valueType.unit = value;
                  setData({ ...data });
                }}
                value={data.valueType.unit}
              >
                {Array.from(new Set<string>(units.map(unit => unit.typeText))).map(type => {
                  const typeData = groupBy(units, unit => unit.typeText)[type];
                  return (
                    <Select.OptGroup label={type} key={type}>
                      {typeData.map((e: Unit) => (
                        <Select.Option value={e.id} key={e.id}>
                          {e.name} / {e.symbol}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        );
      case 'text':
        return (
          <div>
            <Form.Item label="数据长度">
              <Input
                addonAfter="字节"
                value={data.length}
                onChange={event => {
                  data.length = event.target.value;
                  setData({ ...data });
                }}
              />
            </Form.Item>
          </div>
        );
      case 'bool':
        return (
          <div>
            <Form.Item label="布尔值">
              <Input
                addonBefore="0"
                placeholder="如：关"
                value={data.valueType.false}
                onChange={event => {
                  // const value = ;
                  data.valueType.false = event.target.value;
                  // data.valueType = value;
                  setData({ ...data });
                }}
              />
              <Form.Item>
                <Input
                  addonBefore="1"
                  placeholder="如：开"
                  value={data.valueType.true}
                  onChange={event => {
                    // data.valueType = {
                    //     true: event.target.value
                    // };
                    data.valueType.true = event.target.value;
                    setData({ ...data });
                  }}
                />
              </Form.Item>
            </Form.Item>
          </div>
        );
      case 'date':
        return (
          <div>
            <Form.Item label="时间格式">
              <Select
                value={data.valueType.dateFormat}
                onChange={(value: string) => {
                  data.valueType.dateFormat = value;
                  setData({ ...data });
                }}
              >
                <Select.Option value="string">String类型的UTC时间戳 (毫秒)</Select.Option>
                <Select.Option value="yyyy-MM-dd">yyyy-MM-dd</Select.Option>
                <Select.Option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</Select.Option>
                <Select.Option value="yyyy-MM-dd HH:mm:ss EE">yyyy-MM-dd HH:mm:ss EE</Select.Option>
                <Select.Option value="yyyy-MM-dd HH:mm:ss zzz">
                  yyyy-MM-dd HH:mm:ss zzz
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        );
      case 'array':
        return (
          <div>
            <Form.Item label="元素类型">
              <Radio.Group
                value={data.valueType.arrayType}
                onChange={e => {
                  data.valueType.arrayType = e.target.value;
                  setData({ ...data });
                }}
              >
                <Radio value="int32">int32</Radio>
                <Radio value="float">float</Radio>
                <Radio value="double">double</Radio>
                <Radio value="text">text</Radio>
                <Radio value="struct">struct</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="元素个数">
              <Input
                value={data.valueType.elementNumber}
                onChange={e => {
                  data.valueType.elementNumber = e.target.value;
                  setData({ ...data });
                }}
              />
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
            {(data.valueType.parameters || []).length > 0 && (
              <List
                bordered
                dataSource={data.valueType.parameters || []}
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
                          const index = data.valueType.parameters.findIndex(
                            (i: any) => i.id === item.id,
                          );
                          data.valueType.parameters.splice(index, 1);
                          setData({ ...data });
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
              }}
            >
              <Icon type="plus" />
              添加参数
            </Button>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  function saveData() {
    // 递归保存数据
    if (data.valueType.type === 'enum') {
      data.valueType.properties = enumData;
    }
    props.save(data);
    message.success('保存成功');
    props.close();
  }

  return (
    <Drawer
      title="新增参数"
      placement="right"
      closable={false}
      onClose={() => props.close()}
      visible
      width="30%"
    >
      <Form className={styles.paramterForm}>
        <Form.Item label="标识符">
          <Input
            disabled={!!props.data.id}
            value={data.id}
            onChange={e => {
              data.id = e.target.value;
              setData({ ...data });
            }}
          />
        </Form.Item>
        <Form.Item label="参数名称">
          <Input
            value={data.name}
            onChange={e => {
              data.name = e.target.value;
              setData({ ...data });
            }}
          />
        </Form.Item>
        <Form.Item label="数据类型">
          <Select
            placeholder="请选择"
            value={data.valueType?.type}
            onChange={(value: string) => {
              if (!data.valueType) {
                data.valueType = {};
              }
              data.valueType.type = value;
              dataTypeChange(value);
              setData({ ...data });
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
          </Select>
        </Form.Item>
        {renderDetailForm()}
        <Form.Item label="描述">
          <Input.TextArea
            value={data.description}
            onChange={e => {
              data.description = e.target.value;
              setData({ ...data });
            }}
            rows={3}
          />
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
      {parameterVisible && (
        <Paramter
          data={currentParameter}
          save={item => {
            if (!data.valueType.parameters) {
              data.valueType.parameters = [];
            }
            const index = data.valueType.parameters.findIndex((e: any) => e.id === item.id);
            if (index === -1) {
              data.valueType.parameters.push(item);
            } else {
              data.valueType.parameters[index] = item;
            }
            setData({ ...data });
            // props.close();
          }}
          close={() => setParameterVisible(false)}
        />
      )}
    </Drawer>
  );
};

export default Paramter;
