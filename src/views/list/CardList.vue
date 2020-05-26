<template>
  <div>
    <div>
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="服务管理"
        sub-title="各个服务信息"
      >
        <template>
          <a-tabs default-active-key="1" @change="tabChange">
            <a-tab-pane key="1" tab="Chat"></a-tab-pane>
            <a-tab-pane key="2" tab="Push"></a-tab-pane>
            <a-tab-pane key="3" tab="Connector"></a-tab-pane>
          </a-tabs>
        </template>
        <a-list
          rowKey="id"
          :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
          :dataSource="serverInfo"
        >
          <a-list-item slot="renderItem" slot-scope="item, index">
            <template v-if="false">
              <a-button class="new-btn" type="dashed">
                <a-icon type="plus"/>
                新增产品
              </a-button>
            </template>
            <template v-else>
              <a-card :hoverable="true">
                <a-card-meta>
                  <a slot="title">{{ '服务器信息' }}</a>
                  <!--              <a-avatar class="card-avatar" slot="avatar" :src="a" size="large"/>-->
                  <div class="meta-content" slot="description">{{ '服务名:' + item.name }}</div>
                  <div class="meta-content" slot="description">{{ '服务IP:' + item.ip }}</div>
                  <template v-if="item.name === 'connector'">
                    <div class="meta-content" slot="description">{{ '服务端口:' + item.port }}</div>
                    <template v-if="item.status === '1'">
                      <div class="meta-content" slot="description">{{ '服务状态:' + '可用' }}</div>
                    </template>
                    <template v-else>
                      <div class="meta-content warn-font" slot="description">{{ '服务状态:' + '不可用' }}</div>
                    </template>
                    <div class="meta-content" slot="description">{{ '在线人数:' + item.userCount }}</div>
                    <div class="meta-content" slot="description">{{ '服务权重:' + item.weight }}</div>
                    <template v-if="item.releasing === '1'">
                      <div class="meta-content warn-font" slot="description">{{ '释放长连接状态:' + '运行中' }}</div>
                    </template>
                    <template v-else>
                      <div class="meta-content" slot="description">{{ '释放长连接状态:' + '空闲' }}</div>
                    </template>
                  </template>
                </a-card-meta>

                <template v-if="item.name === 'connector'" class="ant-card-actions" slot="actions">
                  <div>
                    <a-button type="small" @click="showRecover(index)">
                      恢复
                    </a-button>
                    <a-modal
                      title="恢复服务"
                      :visible="recoverVisible"
                      :confirm-loading="confirmLoading"
                      @ok="handlerRecover"
                      @cancel="handleCancel"
                    >
                      <p>{{ recoverMsg }}</p>
                    </a-modal>
                  </div>
                  <div>
                    <a-button type="small" @click="showRelease(index)">
                      转移长连接
                    </a-button>
                    <a-modal
                      title="转移长连接"
                      :visible="releaseVisible"
                      :confirm-loading="confirmLoading"
                      @ok="handlerRelease"
                      @cancel="handleCancel"
                    >
                      <p>{{ releaseMsg }}</p>
                    </a-modal>
                  </div>
                </template>
              </a-card>
            </template>
          </a-list-item>
        </a-list>
      </a-page-header>
    </div>
  </div>
</template>

<script>
  import {
    getServerInfo,
    releaseConnections,
    recoverServer
  } from '@/api/admin'

  export default {
    name: 'CardList',
    data () {
      return {
        extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
        serverInfo: [],
        recoverMsg: '确定要要恢复服务吗？',
        releaseMsg: '确定要转移长连接吗？',
        recoverVisible: false,
        releaseVisible: false,
        confirmLoading: false,
        myIndex: 0
      }
    },
    created () {
      this.getServerInfoByName('Chat')
    },
    methods: {
      getServerInfoByName (serverType) {
        getServerInfo(serverType).then(res => {
          this.serverInfo = []
          for (const resKey in res) {
            this.serverInfo.push(res[resKey])
          }
        })
      },
      tabChange (val) {
        if (val === '1') {
          this.getServerInfoByName('chat')
        }
        if (val === '2') {
          this.getServerInfoByName('push')
        }
        if (val === '3') {
          this.getServerInfoByName('connector')
        }
      },
      showRecover (index) {
        this.myIndex = index
        this.recoverVisible = true
      },
      showRelease (index) {
        this.myIndex = index
        this.releaseVisible = true
      },
      handlerRelease () {
        const val = this.serverInfo[this.myIndex]
        console.log('======ReleaseConnections！')
        this.releaseMsg = '转移长连接中，时间可能较长，请等候...'
        this.confirmLoading = true
        releaseConnections(val.name, val.ip, val.port).then(res => {
          if (res.ret.errorCode === 'SUCCESS') {
            console.log('=====ReleaseConnections success')
          }
        })
        setTimeout(() => {
          this.getServerInfoByName('connector')
          this.releaseVisible = false
          this.confirmLoading = false
          this.releaseMsg = '确定要转移长连接吗？'
        }, 2000)
      },
      handlerRecover () {
        const val = this.serverInfo[this.myIndex]
        console.log('======RecoveringServer！')
        this.recoverMsg = '恢复服务中，请稍候...'
        this.confirmLoading = true
        recoverServer(val.name, val.ip, val.port).then(res => {
          if (res.ret.errorCode === 'SUCCESS') {
            console.log('=====RecoveringServer success')
          }
        })
        setTimeout(() => {
          this.getServerInfoByName('connector')
          this.recoverVisible = false
          this.confirmLoading = false
          this.recoverMsg = '确定要要恢复服务吗？'
        }, 1000)
      },
      handleCancel (e) {
        console.log('=====Clicked cancel button')
        this.recoverVisible = false
        this.releaseVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .card-list {
    /deep/ .ant-card-body:hover {
      .ant-card-meta-title > a {
        color: @primary-color;
      }
    }

    /deep/ .ant-card-meta-title {
      margin-bottom: 12px;

      & > a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0, 0, 0, .85);
      }
    }

    /deep/ .meta-content {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      margin-bottom: 1em;
    }
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;

        &:hover {
          color: @primary-color;
        }
      }
    }

    .align-center {
      width: 100%;
      height: 4rem;
      line-height: 4rem;
      text-align: center;
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

  .warn-font {
    color: red;
  }

</style>
