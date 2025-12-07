'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
    Box,
    ExternalLink,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    ShieldAlert,
    ShieldCheck
} from 'lucide-react'

// Mock Data matching our Scenarios
const MOCK_CONTRACTS = [
    // Linked to Scenario 1 (Deposit)
    { name: 'HM25_Vault', address: '0x8f...2a', type: 'Vault', balance: '1.2M QU', txs: 1420, status: 'verified', version: 'v2.1' },
    // Linked to Scenario 2 (Withdraw Fail)
    { name: 'Qubic_Swap_Router', address: '0x9c...bb', type: 'DeFi', balance: '560K QU', txs: 8902, status: 'verified', version: 'v1.0' },
    // Linked to Scenario 3 (Loop)
    { name: 'Oracle_Price_Feed', address: '0x3d...ff', type: 'Oracle', balance: '12K QU', txs: 45000, status: 'warning', version: 'v0.9' },
    
    { name: 'Gaming_Token_A', address: '0x9d...11', type: 'Token', balance: '0 QU', txs: 12, status: 'verified', version: 'v1.0' },
    { name: 'Test_Contract_01', address: '0x2a...bb', type: 'Debug', balance: '100 QU', txs: 5, status: 'pending', version: 'beta' },
]

interface SmartContractsViewProps {
    onTxClick: (hash: string) => void
}

export function SmartContractsView({ onTxClick }: SmartContractsViewProps) {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [contracts, setContracts] = useState(MOCK_CONTRACTS)
  const [uploadedJson, setUploadedJson] = useState<any>(null)
  const [uploadedCpp, setUploadedCpp] = useState<string>('')
  const [cppFile, setCppFile] = useState<File | null>(null)

  // Zod schemas for validation
  const jsonSchema = z.object({
    // Fake schema, assume has some fields
    any: z.any()
  }).passthrough()

  const cppSchema = z.string().refine((val) => val.includes('#include') || val.includes('int main'), {
    message: "Invalid C++ file"
  })

 

  const handleJsonUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Validate with Zod
        jsonSchema.parse(data)
        setUploadedJson(data)
      } catch (error) {
        console.error('Invalid JSON file:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleCppUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      try {
        // Validate with Zod
        cppSchema.parse(content)
        setUploadedCpp(content)
        setCppFile(file)
      } catch (error) {
        console.error('Invalid C++ file:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = () => {
    if (uploadedCpp && cppFile) {
      const newContract = {
        name: cppFile.name.replace('.cpp', ''),
        address: '0x' + Math.random().toString(16).substr(2, 8) + '...new',
        type: 'Uploaded',
        balance: '0 QU',
        txs: 0,
        status: 'pending',
        version: 'v1.0'
      }
      setContracts(prev => [...prev, newContract])
      // Reset
      setUploadedJson(null)
      setUploadedCpp('')
      setCppFile(null)
      setShowUploadForm(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* INPUT SECTION - Only show when deploy clicked */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>Upload trans.json and C++ source code for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Transaction JSON (trans.json)</label>
                <FileUpload
                  onFileSelect={handleJsonUpload}
                  accept={{ "application/json": [".json"] }}
                  placeholder="Drop trans.json here or click to browse"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">C++ Source Code (.cpp)</label>
                <FileUpload
                  onFileSelect={handleCppUpload}
                  accept={{ "text/x-c": [".cpp", ".hpp", ".c", ".h"] }}
                  placeholder="Drop .cpp file here or click to browse"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!uploadedCpp}
                className="bg-green-600 hover:bg-green-500 text-white font-bold"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* ACTION BAR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
            <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search contracts..." className="pl-8 bg-card border-border" />
            </div>
            <Button variant="outline" className="border-border text-muted-foreground">
                <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
        </div>
        {!showUploadForm && (
          <Button onClick={() => setShowUploadForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" /> Deploy Contract
          </Button>
        )}
      </div>

      {/* CONTRACTS TABLE */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <div className="p-0">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-bold">Contract Name</th>
                        <th className="px-6 py-4 font-bold">Address / Scenario</th>
                        <th className="px-6 py-4 font-bold">Type</th>
                        <th className="px-6 py-4 font-bold">Balance</th>
                        <th className="px-6 py-4 font-bold">Activity</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {contracts.map((contract, i) => (
                        <tr 
                            key={i} 
                            onClick={() => onTxClick(contract.address)}
                            className="hover:bg-blue-500/10 transition-colors group cursor-pointer"
                        >
                            <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                                <Box className="w-4 h-4 text-blue-500/70" />
                                {contract.name}
                            </td>
                            <td className="px-6 py-4 font-mono text-muted-foreground group-hover:text-blue-400 transition-colors">
                                <div className="flex items-center gap-2">
                                    {contract.address}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
                                    {contract.type}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 font-mono text-foreground font-bold">
                                {contract.balance}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {contract.txs.toLocaleString()} txs
                            </td>
                            <td className="px-6 py-4">
                                {contract.status === 'verified' && (
                                    <Badge className="bg-green-500/10 text-green-500 border-none flex w-fit items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Verified
                                    </Badge>
                                )}
                                {contract.status === 'warning' && (
                                    <Badge className="bg-yellow-500/10 text-yellow-500 border-none flex w-fit items-center gap-1">
                                        <ShieldAlert className="w-3 h-3" /> Auditing
                                    </Badge>
                                )}
                                {contract.status === 'pending' && (
                                    <Badge className="bg-blue-500/10 text-blue-500 border-none">
                                        DevNet Only
                                    </Badge>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>

    </div>
  )
}