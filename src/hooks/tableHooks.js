import React, {useState, useEffect, useMemo} from 'react';
import BTable from 'react-bootstrap/Table';
import {useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';
import MDEditor from '@uiw/react-md-editor';

export const useTableRender = () => {

    const renderAdminTable = (table, headers, userAction, redirect, userData) => {

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            } = table;

        return (
            <BTable striped bordered hover size="sm" {...getTableProps()}>
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, index) => {
                          if (index === headers.length - 1) {
                            return (
                                <td {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button type="button" class="btn btn-danger" onClick={e=>userAction(row.original.id, 'delete')}>{'D'}</button>
                                      <button type="button" class="btn btn-warning" onClick={e=>{userAction(row.values.id, 'block')}}>{row.original.blocked?'U':'B'}</button>
                                      <button type="button" class="btn btn-success" 
                                      onClick={e=>userAction(row.values.id, 'promote')}>{row.original.admin?'▼':'▲'}</button>
                                      <button type="button" class="btn btn-primary" onClick={e=>redirect(row.original.id)}>{'▶'}</button>
                                    </div>
                                    <div class="btn-group-vertical">
                                    <button type="button" class="btn btn-danger" onClick={e=>userAction(row.original.id, 'delete')}>{'D'}</button>
                                      <button type="button" class="btn btn-warning" onClick={e=>{userAction(row.values.id, 'block')}}>{row.original.blocked?'U':'B'}</button>
                                      <button type="button" class="btn btn-success" 
                                      onClick={e=>userAction(row.values.id, 'promote')}>{row.original.admin?'▼':'▲'}</button>
                                      <button type="button" class="btn btn-primary" onClick={e=>redirect(row.original.id)}>{'▶'}</button>
                                    </div>
                                </td>
                            )
                          }

                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
            </BTable>
        )   
    }



    const renderCollectionTable = (table, headers, selectHandler, redirect, userData, collectionData) => {



      function GlobalFilter({
          preGlobalFilteredRows,
          globalFilter,
          setGlobalFilter,
        }) {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = React.useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
          setGlobalFilter(value || undefined)
        }, 1000)
      
        return (
          <span>
            Search:{' '}
            <input className='table-filter form-control d-inline-block'
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} records...` }
              style={{
                fontSize: '1.1rem',
                border: '0',
              }}
            />
          </span>
        )
      }

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = table;

      return (
          <BTable striped bordered hover size="sm" id='collection-table' {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => {
                    return (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? " ▲" : " ▼") : ""}
                    </th>)
                  })}
                </tr>
              ))}
              <tr>
                <th
                  colSpan={table.visibleColumns.length}
                  style={{
                    textAlign: 'left',
                  }}
                >
                  <GlobalFilter
                    preGlobalFilteredRows={table.preGlobalFilteredRows}
                    globalFilter={table.state.globalFilter}
                    setGlobalFilter={table.setGlobalFilter}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                      if (index === 0 && (userData.userId === collectionData.creator || userData.admin)) {
                        return (
                          <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                          <input type='checkbox' className='checkbox-cell' data-id={cell.row.original._id} onChange={selectHandler} />
                        </td>
                        )
                      } 
                      if (index === headers.length - 1) {
                        return (
                          <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                          <button type="button" className="btn btn-primary btn-desktop" data-id={row.values._id} onClick={(e)=>{redirect(e)}}>
                          {userData.language==='en'?'Open':'Открыть'}</button>
                          <button type="button" className="btn btn-primary btn-mobile" data-id={row.values._id} onClick={(e)=>{redirect(e)}}>
                          {'▶'}</button>
                        </td>
                        )
                      }
                      if (cell.column.fieldType && cell.column.fieldType.includes('text')) {
                        return (
                          <td {...cell.getCellProps()}>
                          <MDEditor.Markdown 
                            source={cell.value} 
                          />
                        </td>
                          
                        )
                      }
                      return (
                        <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </BTable>
      )     
    }

    return {renderAdminTable, renderCollectionTable}
}